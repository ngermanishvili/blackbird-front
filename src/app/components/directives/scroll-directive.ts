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
import { InViewService } from '../../main-service';

@Directive({
  selector: '[appInView]',
  standalone: true,
})
export class InViewDirective implements OnInit, OnDestroy {
  @Output() inView: EventEmitter<boolean> = new EventEmitter();

  private observer!: IntersectionObserver;
  private readonly inViewClass = 'in-view';
  private isBrowser: boolean;
  private windowiSize = 0;
  private scrollListener: (() => void) | undefined;
  private hasTriggered = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private sharedService: InViewService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      window.addEventListener('resize', this.onResize.bind(this));
      window.addEventListener('scroll', this.checkSectionScroll.bind(this));
    }
  }

  // @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkSectionScroll();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.checkSectionScroll.bind(this));
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  // @HostListener('window:resize', [])
  onResize() {
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

// old code for just some time

// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   Inject,
//   PLATFORM_ID,
//   OnDestroy,
//   OnInit,
//   Output,
//   EventEmitter,
//   HostListener,
// } from "@angular/core";
// import { isPlatformBrowser } from "@angular/common";

// @Directive({
//   selector: "[appInView]",
//   standalone: true,
// })
// export class InViewDirective implements OnInit, OnDestroy {
//   @Output() inView: EventEmitter<boolean> = new EventEmitter();menu__item cursor-pointer

//   private observer!: IntersectionObserver;
//   private readonly inViewClass = "in-view";
//   private isBrowser: boolean;
//   private scrollListener: (() => void) | undefined;

//   constructor(
//     private element: ElementRef,
//     private renderer: Renderer2,
//     @Inject(PLATFORM_ID) private platformId: any
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (this.isBrowser) {
//       this.checkSectionScroll();
//       // Attach scroll listener
//       this.scrollListener = this.renderer.listen('window', 'scroll', () => this.checkSectionScroll());
//     }
//   }

//   @HostListener('window:scroll', [])
//   onWindowScroll() {
//     if (this.isBrowser) {
//       this.checkSectionScroll();
//     }
//   }

//   ngOnDestroy() {
//     if (this.scrollListener) {
//       this.scrollListener();
//     }
//   }

//   private checkSectionScroll() {
//     const rect = this.element.nativeElement.getBoundingClientRect();
//     const distanceFromBottom = window.innerHeight - rect.bottom;
//     if (distanceFromBottom > -100) {
//       this.renderer.addClass(
//         this.element.nativeElement,
//         this.inViewClass
//       );
//       this.inView.emit(true);
//     }
//     // else {
//     //   this.renderer.removeClass(
//     //     this.element.nativeElement,
//     //     this.inViewClass
//     //   );
//     //   this.inView.emit(false);
//     // }

//   }

// }
