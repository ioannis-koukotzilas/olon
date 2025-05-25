import { ProductImage } from "../product";

export class Cart {
  id?: string;
  checkoutUrl?: string;
  totalPrice?: string;
  lines: CartLine[] = [];
  totalItems: number = 0;
}

export class CartLine {
  id!: string;
  quantity!: number;
  merchandiseId!: string;
  title!: string;
  price!: string;
  featuredImage?: ProductImage;
  handle!: string;
}