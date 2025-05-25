export class SwiperSlide {
  image!: SwiperSlideImage;
  title?: string;
  subtitle?: string;

  constructor(image: SwiperSlideImage, title?: string, subtitle?: string) {
    this.image = image;
    this.title = title;
    this.subtitle = subtitle;
  }
}

export class SwiperSlideImage {
  src!: string;
  alt?: string;

  constructor(src: string, alt?: string) {
    this.src = src;
    this.alt = alt;
  }
}