import {
  Directive,
  ElementRef,
  Renderer2,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appInViewMobile]',
  standalone: true,
})
export class InViewMobileDirective implements OnInit, OnDestroy {
  @Output() inView: EventEmitter<boolean> = new EventEmitter();
  private readonly inViewClass = 'in-view';
  private isBrowser: boolean;
  private windowiSize = 0;
  private scrollListener: (() => void) | undefined;
  private hasTriggered = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkSectionScroll();
      window.addEventListener('resize', this.onResize.bind(this));
      this.scrollListener = this.renderer.listen('window', 'scroll', () =>
        this.checkSectionScroll()
      );
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkSectionScroll();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResize.bind(this));
      if (this.scrollListener) {
        this.scrollListener();
      }
    }
  }

  private onResize() {
    if (this.isBrowser) {
      this.windowiSize = window.innerWidth;
    }
  }

  private checkSectionScroll() {
    const rect = this.element.nativeElement.getBoundingClientRect();
    const elementHeight = rect.height;
    const elementTop = rect.top;
    const elementBottom = rect.bottom;
    const windowHeight = window.innerHeight;
    const elementHasClass = this.element.nativeElement.classList.contains(
      this.inViewClass
    );

    // Calculate how much of the element is visible
    const visibleHeight =
      Math.min(elementBottom, windowHeight) - Math.max(elementTop, 0);
    const visiblePercentage = (visibleHeight / elementHeight) * 100;

    // Trigger when 20% of the element is visible
    if (!this.hasTriggered && visiblePercentage >= 20) {
      this.renderer.addClass(this.element.nativeElement, this.inViewClass);
      this.inView.emit(true);
      this.hasTriggered = true;
    }
  }
}
