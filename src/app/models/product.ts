export class Product {
  id!: string;
  handle!: string;
  title!: string;
  description!: string;
  variants: Variant[] = [];
  images: ProductImage[] = [];
}

export class Variant {
  id!: string;
  priceV2!: PriceV2;
  selectedOption!: SelectedOption;
}

export class PriceV2 {
  amount!: string;
  currencyCode!: string;
}

export class SelectedOption {
  name!: string;
  value!: string;
}

export class ProductImage {
  src!: string;
}