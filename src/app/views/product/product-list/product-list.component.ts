import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ShopifyService } from '../../../services/shopify.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private shopifyService = inject(ShopifyService);

  products: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.shopifyService.getProducts().subscribe({
      next: (result: any) => {
        this.initProducts(result.data);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete() {
        console.log('observable completed');
      },
    });
  }

  private initProducts(data: any): void {
    data.products.nodes.forEach((node: any) => {
      let product = new Product();
      product.title = node.title;
      product.description = node.description;
      product.handle = node.handle;

      this.products.push(product);
    });
  }
}
