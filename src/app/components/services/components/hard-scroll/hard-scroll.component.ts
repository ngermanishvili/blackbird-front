import { NgClass, NgFor, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InViewService } from '../../../../main-service';
import { TranslationService } from '../../../core/lang.service';

@Component({
  selector: 'app-hard-scroll',
  standalone: true,
  imports: [NgFor, NgStyle, NgClass],
  templateUrl: './hard-scroll.component.html',
  styleUrl: './hard-scroll.component.scss',
})
export class HardScrollComponent implements OnInit, AfterViewInit, OnDestroy {
  data = input<any[]>([]);
  public translate = inject(TranslationService);
  public service = inject(InViewService);
  isScrolled: boolean[] = [];
  topPositions: number[] = [];
  private boundScrollHandler: any;

  // Safe window access for SSR compatibility
  isMobile = false;
  stickyTopOffset = 45;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChildren('blockTitle') blockTitles!: QueryList<ElementRef>;
  isBrowser = false;

  // Scroll threshold - how far from the element should trigger the sticky effect
  private scrollThreshold = 150;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Create bound handler once to avoid memory leaks
    this.boundScrollHandler = this.onScroll.bind(this);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.updateScreenSize();
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.boundScrollHandler, {
          passive: true,
        });
        window.addEventListener('resize', this.updateScreenSize.bind(this), {
          passive: true,
        });
      });
    }
  }

  // Helper method to update screen size related values
  private updateScreenSize(): void {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= 769;
      this.stickyTopOffset = this.isMobile ? 60 : 45;
    }
  }

  // Calculate sticky position for an index
  getStickyTopPosition(index: number): string {
    return `${this.stickyTopOffset + 83 * index}px`;
  }

  // Initialize sticky state and top positions after view initialization
  ngAfterViewInit() {
    if (this.isBrowser) {
      // Delay initialization slightly to ensure DOM is ready
      setTimeout(() => {
        // Initialize all as not scrolled
        this.isScrolled = new Array(this.data().length).fill(false);
        this.initializePositions();
        // Force initial calculation
        this.onScroll();
      }, 500);

      // Listen for viewport changes and recalculate positions
      window.addEventListener(
        'resize',
        () => {
          this.ngZone.runOutsideAngular(() => {
            this.initializePositions();
            this.updateScreenSize();
            this.onScroll();
          });
        },
        { passive: true }
      );
    }
  }

  private initializePositions(): void {
    if (!this.blockTitles || this.blockTitles.length === 0) return;

    this.topPositions = this.blockTitles.map((blockTitle) => {
      const rect = blockTitle.nativeElement.getBoundingClientRect();
      return rect.top + window.pageYOffset;
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.boundScrollHandler);
      window.removeEventListener('resize', this.updateScreenSize.bind(this));
      window.removeEventListener('resize', this.initializePositions.bind(this));
    }
  }

  // Optimized scroll handler
  onScroll(): void {
    if (!this.isBrowser || !this.topPositions.length) return;

    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Use a flag to detect changes and run change detection only once if needed
    let hasChanges = false;

    this.data().forEach((_, index) => {
      const elementTop = this.topPositions[index];
      if (!elementTop && elementTop !== 0) return;

      // Get the element height to calculate better thresholds
      const element = this.blockTitles.toArray()[index]?.nativeElement;
      if (!element) return;

      const parentNode = element.parentNode;
      const contentHeight =
        parentNode?.querySelector('.block-content-parent')?.offsetHeight || 400;

      // Calculate where the element is in relation to the viewport
      const headerHeight = this.isMobile ? 60 : 45;
      const titleHeight = 83;
      const stickyOffset = headerHeight + titleHeight * index;

      // Make sure we've scrolled past most of the content before triggering
      const elementTopWithGap =
        elementTop + contentHeight - this.scrollThreshold;

      // Element is considered "scrolled to" when we've scrolled past most of its content
      const shouldBeSticky = scrollPosition + stickyOffset >= elementTopWithGap;

      // Update only if the state has changed
      if (this.isScrolled[index] !== shouldBeSticky) {
        this.isScrolled[index] = shouldBeSticky;
        hasChanges = true;
      }
    });

    // If we have changes, run change detection
    if (hasChanges) {
      this.ngZone.run(() => {});
    }
  }
}
