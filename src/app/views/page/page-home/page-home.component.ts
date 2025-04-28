import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-home',
  imports: [CommonModule],
  templateUrl: './page-home.component.html',
  styleUrl: './page-home.component.css',
})
export class PageHomeComponent implements OnInit {
  loading$: Observable<boolean>;

  @ViewChild('swiperRef', { static: false })
  swiperRef!: ElementRef<HTMLElement>;

  constructor(
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef
  ) {
    this.loadingService.set(true);
    this.loading$ = this.loadingService.loading$;
  }

  images: string[] = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=3000&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=3000&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=3000&q=80',
  ];

  ngOnInit(): void {
    this.loadingService.set(false);
  }
}
