import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ShopifyService } from '../../../services/shopify.service';
import {
  Details,
  HowToUse,
  PriceV2,
  Product,
  ProductImage,
  SelectedOption,
  Variant,
} from '../../../models/product';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartLineInput } from '../../../models/cart/cartLineInput';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  private route = inject(ActivatedRoute);
  private shopifyService = inject(ShopifyService);
  private cartService = inject(CartService);
  private cd = inject(ChangeDetectorRef);

  product!: Product;

  selectedVariantId!: string;
  selectedPrice!: string;

  constructor() {
    console.log("1");
  }

  ngOnInit(): void {
    this.checkRouteParams();
    console.log("2");
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkRouteParams(): void {
    const sub = this.route.params
      .pipe(
        switchMap((params) => {
          const handle = params['handle'];
          return this.shopifyService.getProduct(handle).pipe(take(1));
        }),
        tap((response: any) => {
          this.product = this.initProduct(response.data.product);
          console.log("3");
        })
      )
      .subscribe({
        next: () => {
          this.selectedVariantId = this.product.variants[0].id;
          this.selectedPrice =
            this.product.variants[0].priceV2.amount +
            this.product.variants[0].priceV2.currencyCode;

            console.log("4");

          //  this.cd.markForCheck();
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete() {
          console.log('observable completed');
          console.log("5");
        },
      });

    this.subscriptions.add(sub);
  }

  private initProduct(product: any): Product {
    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      variants: this.initProductVariants(product.variants),
      images: this.initProductImages(product.images),
      howToUse: this.initHowToUse(product.metafields),
      details: this.initDetails(product.metafields),
    };
  }

  private initProductVariants(variants: any): Variant[] {
    const returnValue: Variant[] = [];

    variants.nodes.forEach((node: any) => {
      const variant: Variant = {
        id: node.id,
        priceV2: this.initVariantPriceV2(node.priceV2),
        selectedOption: this.initVariantSelectedOption(node.selectedOptions),
      };

      returnValue.push(variant);
    });

    return returnValue;
  }

  private initVariantPriceV2(priceV2: any): PriceV2 {
    return {
      amount: priceV2.amount,
      currencyCode: priceV2.currencyCode,
    };
  }

  private initVariantSelectedOption(selectedOptions: any): SelectedOption {
    return {
      name: selectedOptions[0].name,
      value: selectedOptions[0].value,
    };
  }

  private initProductImages(images: any): ProductImage[] {
    const returnValue: ProductImage[] = [];

    images.nodes.forEach((image: any) => {
      const productImage: ProductImage = {
        src: image.src,
      };

      returnValue.push(productImage);
    });

    return returnValue;
  }

  private initHowToUse(metafields: any[]): HowToUse | null {
    if (!metafields) return null;

    const title =
      metafields.find((x) => x?.key === 'how_to_use_title')?.value ?? null;

    const description =
      metafields.find((x) => x?.key === 'how_to_use_description')?.value ??
      null;
    const imageSrc =
      metafields.find((x) => x?.key === 'how_to_use_image')?.reference?.image
        ?.url ?? null;

    if (!title || !description || !imageSrc) {
      return null;
    }

    return {
      title: title,
      description: description,
      imageSrc: imageSrc,
    };
  }

  private initDetails(metafields: any[]): Details | null {
    if (!metafields) return null;

    const title =
      metafields.find((x) => x?.key === 'details_title')?.value ?? null;

    const description =
      metafields.find((x) => x?.key === 'how_to_use_description')?.value ??
      null;

    const imageSrc =
      metafields.find((x) => x?.key === 'how_to_use_image')?.reference?.image
        ?.url ?? null;

    if (!title || !description || !imageSrc) {
      return null;
    }

    return {
      title: title,
      description: description,
      imageSrc: imageSrc,
    };
  }

  onVariantSelect(variant: Variant): void {
    this.selectedVariantId = variant.id;
    this.selectedPrice = variant.priceV2.amount + variant.priceV2.currencyCode;
  }

  addToCart(): void {
    const input: CartLineInput = {
      merchandiseId: this.selectedVariantId,
      quantity: 1,
    };

    this.cartService.addItem(input);
  }
}
