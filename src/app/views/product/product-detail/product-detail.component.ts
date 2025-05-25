import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
import { Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartLineInput } from '../../../models/cart/cartLineInput';
import { FormsModule } from '@angular/forms';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, TranslatePipe, TranslateDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  loading$: Observable<boolean>;

  product!: Product;

  selectedVariantId!: string;
  selectedPrice!: string;

  activeVariantIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private shopifyService: ShopifyService,
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {
    this.loadingService.set(true);
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.checkRouteParams();
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
        })
      )
      .subscribe({
        next: () => {
          this.selectedVariantId = this.product.variants[0].id;
          this.selectedPrice =
            this.product.variants[0].priceV2.amount +
            this.product.variants[0].priceV2.currencyCode;

          this.loadingService.set(false);
          this.cd.markForCheck();
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete() {
          console.log('observable completed');
        },
      });

    this.subscriptions.add(sub);
  }

  private initProduct(product: any): Product {
    const initProductVariants = (variants: any): Variant[] => {
      const returnValue: Variant[] = [];

      variants.nodes.forEach((node: any) => {
        const variant: Variant = {
          id: node.id,
          priceV2: initVariantPriceV2(node.priceV2),
          selectedOption: initVariantSelectedOption(node.selectedOptions),
        };

        returnValue.push(variant);
      });

      return returnValue;
    };

    const initVariantPriceV2 = (priceV2: any): PriceV2 => {
      return {
        amount: priceV2.amount,
        currencyCode: priceV2.currencyCode,
      };
    };

    const initVariantSelectedOption = (
      selectedOptions: any
    ): SelectedOption => {
      return {
        name: selectedOptions[0].name,
        value: selectedOptions[0].value,
      };
    };

    const initProductImages = (images: any): ProductImage[] => {
      const returnValue: ProductImage[] = [];

      images.nodes.forEach((image: any) => {
        const productImage: ProductImage = {
          src: image.src,
          altText: image.altText
        };

        returnValue.push(productImage);
      });

      return returnValue;
    };

    const initHowToUse = (metafields: any[]): HowToUse | null => {
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
    };

    const initDetails = (metafields: any[]): Details | null => {
      if (!metafields) return null;

      const title =
        metafields.find((x) => x?.key === 'details_title')?.value ?? null;

      const description =
        metafields.find((x) => x?.key === 'details_description')?.value ?? null;

      const imageSrc =
        metafields.find((x) => x?.key === 'details_image')?.reference?.image
          ?.url ?? null;

      if (!title || !description || !imageSrc) {
        return null;
      }

      return {
        title: title,
        description: description,
        imageSrc: imageSrc,
      };
    };

    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      variants: initProductVariants(product.variants),
      images: initProductImages(product.images),
      howToUse: initHowToUse(product.metafields),
      details: initDetails(product.metafields),
    };
  }

  onVariantSelect(variant: Variant, index: number): void {
    this.selectedVariantId = variant.id;
    this.selectedPrice = variant.priceV2.amount + variant.priceV2.currencyCode;
    this.activeVariantIndex = index;
  }

  isAddingToCart = false;

  addToCart(): void {
    this.isAddingToCart = true;

    const input: CartLineInput = {
      merchandiseId: this.selectedVariantId,
      quantity: 1,
    };

    this.cartService
      .addItem(input)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isAddingToCart = false;
          this.cd.markForCheck();
        },
        error: () => (this.isAddingToCart = false),
      });
  }
}
