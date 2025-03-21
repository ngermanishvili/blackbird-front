import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  Inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[appTrackScroll]',
})
export class TrackScrollDirective {
  @Input('appTrackScroll') elementTop?: number;
  @Input('appTrackScrollBottom') elementBottom?: number;
  @Input() collapseClass = 'compress';
  @Input() showElementClass = 'show-element';
  private scrollListener: (() => void) | undefined;

  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.scrollListener = this.renderer.listen('window', 'scroll', () => {});

      if (this.elementTop) {
        this.trackScrollTop();
      }
      if (this.elementBottom) {
        this.trackScrollBottom();
      }
    }

    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        //   window.addEventListener('resize', this.onResize.bind(this));
        //   this.scrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
      });
    }
  }

  //   @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      if (this.elementTop) {
        this.trackScrollTop();
      }
      if (this.elementBottom) {
        this.trackScrollBottom();
      }
    }
  }

  private trackScrollTop() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const distanceFromTop = rect.top;
    // console.log(this.elementTop ,distanceFromTop);

    if (
      this.elementTop !== undefined &&
      distanceFromTop <= Number(this.elementTop)
    ) {
      this.renderer.addClass(this.el.nativeElement, this.collapseClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.collapseClass);
    }
  }

  private trackScrollBottom() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const distanceFromBottom = window.innerHeight - rect.bottom;
    // console.log(this.elementBottom ,distanceFromBottom);

    // Logging for debugging purposes
    // console.log(`Distance from bottom: ${distanceFromBottom}, Element bottom threshold: ${this.elementBottom}`);

    if (distanceFromBottom >= Number(this.elementBottom) - 300) {
      this.renderer.addClass(this.el.nativeElement, this.showElementClass);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.showElementClass);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }

    // Clean up the scroll listener
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
