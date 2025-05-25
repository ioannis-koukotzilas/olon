import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  SwiperSlide,
  SwiperSlideImage,
} from '../../../models/swiper/SwiperSlide';
import { PlatformService } from '../../../services/platform.service';
import { Swiper } from 'swiper';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'app-page-home',
  imports: [CommonModule],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHomeComponent implements OnInit {
  private platformService = inject(PlatformService);
  private loadingService = inject(LoadingService);
  private cd = inject(ChangeDetectorRef);

  loading$: Observable<boolean>;

  spotlightSlides?: SwiperSlide[];

  @ViewChild('spotlightSwiperRef') spotlightSwiperRef!: ElementRef<HTMLElement>;

  constructor() {
    this.loadingService.set(true);
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.loadingService.set(false);

    if (this.platformService.isBrowser) {
      this.initSpotlightSwiper();
    }
  }

  private initSpotlightSwiper(): void {
    const initSwiper = (): Swiper => {
      return new Swiper(this.spotlightSwiperRef.nativeElement, {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    };

    const image1 = new SwiperSlideImage(
      'https://cdn.shopify.com/s/files/1/0931/1875/9257/files/9.jpg?v=1744399695',
      'Image 1'
    );
    const image2 = new SwiperSlideImage(
      'https://cdn.shopify.com/s/files/1/0931/1875/9257/files/22.jpg?v=1744399695',
      'Image 1'
    );
    const image3 = new SwiperSlideImage(
      'https://cdn.shopify.com/s/files/1/0931/1875/9257/files/9.jpg?v=1744399695',
      'Image 1'
    );

    const slide1 = new SwiperSlide(image1, 'Brush gently', 'Every single day');
    const slide2 = new SwiperSlide(
      image2,
      'We are driven by transparency and the power of science and research',
      'We believe in prevention and cure'
    );
    const slide3 = new SwiperSlide(
      image3,
      'We always go back to where we belong',
      'We go back to nature to feel the balance that is all around us'
    );

    this.spotlightSlides = [slide1, slide2, slide3];

    this.cd.detectChanges();

    initSwiper();
  }
}
