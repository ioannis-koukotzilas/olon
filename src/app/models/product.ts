export class Product {
  id!: string;
  handle!: string;
  title!: string;
  description!: string;
  variants: Variant[] = [];
  images: ProductImage[] = [];
  howToUse?: HowToUse | null;
  details?: Details | null;
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

export class HowToUse {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export class Details {
  title?: string;
  description?: string;
  imageSrc?: string;
}
