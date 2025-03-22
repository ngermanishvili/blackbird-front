import {
  JsonPipe,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  inject,
  input,
  computed,
  signal,
  Signal,
  Input,
  ViewEncapsulation,
  HostListener,
  NgZone,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../core/lang.service';
import { ApiService } from '../../core/api-serice';
import { of } from 'rxjs';

@Component({
  selector: 'app-wizards',
  standalone: true,
  imports: [NgFor, NgIf, JsonPipe, NgStyle, NgClass],
  templateUrl: './wizards.component.html',
  styleUrl: './wizards.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: HttpClient,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        if (isPlatformBrowser(platformId)) {
          return inject(HttpClient);
        }
        return of(null);
      },
    },
  ],
})
export class WizardsComponent {
  @ViewChild('carousel') carousel!: ElementRef;
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  @Input() data: any[] = [];
  @Input() dataCopy: any[] = [];
  title = input('');

  horizontalScrollContainer!: HTMLElement;
  transformStyle: string = 'translateX(0)';
  animationInterval: any;
  duplicateInterval: any;
  animationSpeed: number = 0.5; // Adjust speed as needed
  currentPosition: number = 0;
  service = inject(ApiService);
  public translationService = inject(TranslationService);
  pageAlive = true;
  isBrowser: boolean = false;
  private animationFrameId: number | null = null;
  private loaded = false;
  itemWidth: number = 0;
  slideStep: number = 300; // The distance to move on arrow click

  constructor(@Inject(PLATFORM_ID) platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.pageAlive) {
      this.duplicateProducts();
      this.checkLoadedAndType();

      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
      });
    }
  }

  checkLoadedAndType() {
    const waitForLoaded = setInterval(() => {
      if (this.loaded) {
        clearInterval(waitForLoaded); // Stop checking
        this.startScrolling();
      }
    }, 100); // Check every 100ms
  }

  ngAfterContentChecked(): void {
    if (this.isBrowser && this.data && this.data.length) {
      setTimeout(() => {
        this.horizontalScrollContainer = document?.querySelector(
          '.__wizards'
        ) as HTMLElement;
      }, 1000);
    }
  }

  onWindowScroll() {
    if (this.isBrowser) {
      setTimeout(() => {
        const rect = this.horizontalScrollContainer?.getBoundingClientRect();
        if (rect?.bottom < 800) {
          this.loaded = true;
        }
      }, 100);
    }
  }

  async startScrolling() {
    if (!this.carousel?.nativeElement) {
      return;
    }
    await this.carousel?.nativeElement?.offsetWidth;
    if (this.carouselContainer && this.carousel?.nativeElement?.offsetWidth) {
      // Calculate item width for navigation
      if (this.carousel.nativeElement.children.length > 0) {
        this.itemWidth = this.carousel.nativeElement.children[0].offsetWidth;
      }

      // Start auto-scrolling
      this.continueAutoplay();
    }
  }

  continueAutoplay() {
    const step = () => {
      if (!this.carousel?.nativeElement) {
        return;
      }
      this.currentPosition -= this.animationSpeed;
      this.transformStyle = `translateX(${this.currentPosition}px)`;
      const carouselWidth = this.carousel.nativeElement.offsetWidth;

      if (Math.abs(this.currentPosition) >= carouselWidth / 2) {
        this.duplicateProducts();
      }
      if (this.isBrowser) {
        this.animationFrameId = requestAnimationFrame(step);
      }
    };

    if (this.isBrowser) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      this.animationFrameId = requestAnimationFrame(step);
    }
  }

  navigateCarousel(direction: 'prev' | 'next') {
    // Temporarily pause autoplay
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Calculate the step based on itemWidth or use the default slideStep
    const moveDistance = this.itemWidth > 0 ? this.itemWidth : this.slideStep;

    if (direction === 'prev') {
      this.currentPosition += moveDistance;
    } else {
      this.currentPosition -= moveDistance;
    }

    // Apply the transform
    this.transformStyle = `translateX(${this.currentPosition}px)`;

    // Resume autoplay after a brief pause
    setTimeout(() => {
      this.continueAutoplay();
    }, 1000);
  }

  duplicateProducts(): void {
    if (this.data && this.data?.length)
      this.data = [...this.data, ...this.dataCopy];
  }

  ngOnDestroy(): void {
    this.pageAlive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }
}
