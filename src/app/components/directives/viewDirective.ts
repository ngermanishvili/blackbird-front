import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  HostListener,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InViewService } from '../../main-service';

@Directive({
  selector: '[appInViewSticky]',
  standalone: true,
})
export class InViewStickyDirective implements OnInit, OnDestroy {
  private thresholdDistance = 250; // Distance from the top to trigger
  private scrollHandler?: () => void; // To store the scroll handler for removal later

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private inViewService: InViewService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (isPlatformBrowser(this.platformId)) {
        this.ngZone.runOutsideAngular(() => {
          window.addEventListener('resize', this.onResize.bind(this));
          window.addEventListener('scroll', this.onScroll.bind(this));

          // this.scrollHandler = this.onScroll.bind(this);
          // window.addEventListener('scroll', this.scrollHandler);
        });
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll.bind(this));
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  // @HostListener('window:resize', [])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth <= 768) {
        this.thresholdDistance = 500;
        //   this.windowiSize = window.innerWidth;
      }
    }
  }

  // @HostListener('window:scroll', [])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const rect = this.el.nativeElement.getBoundingClientRect();
      const dataIndex = this.el.nativeElement.getAttribute('data-index');
      // console.log(rect.top);

      // Check if the element is within the 250px from top of viewport
      if (rect.top <= this.thresholdDistance || rect.top <= 0) {
        if (dataIndex !== null) {
          // console.log("Element in view (within 250px from top): ", dataIndex); // Debugging
          this.inViewService.addElementIndex(dataIndex);
        }
      } else {
        if (dataIndex !== null) {
          // console.log("Element out of view (outside 250px): ", dataIndex); // Debugging
          this.inViewService.removeElementIndex(dataIndex);
        }
      }
      // console.log(rect.top);
    }
  }
}

// old code for just some time

// import {
//   Directive,
//   ElementRef,
//   Renderer2,
//   Input,
//   OnInit,
//   OnDestroy,
//   Inject,
//   PLATFORM_ID,
// } from "@angular/core";
// import { isPlatformBrowser } from "@angular/common";
// import { InViewService } from "../../main-service";

// @Directive({
//   selector: "[appInViewSticky]",
//   standalone: true,
// })
// export class InViewStickyDirective implements OnInit, OnDestroy {
//   private observer?: IntersectionObserver;

//   constructor(
//     private el: ElementRef,
//     private inViewService: InViewService,
//     @Inject(PLATFORM_ID) private platformId: object
//   ) { }

//   ngOnInit() {
//     if (isPlatformBrowser(this.platformId)) {
//       this.observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting && entry.intersectionRatio === 1) {
//             const dataIndex = this.el.nativeElement.getAttribute("data-index");
//             if (dataIndex !== null) {
//               this.inViewService.addElementIndex(dataIndex);
//             }
//           } else {
//             const dataIndex = this.el.nativeElement.getAttribute("data-index");
//             if (dataIndex !== null) {
//               this.inViewService.removeElementIndex(dataIndex);
//             }
//           }
//         },
//         { threshold: 1 }
//       );

//       this.observer.observe(this.el.nativeElement);
//     }
//   }

//   ngOnDestroy() {
//     if (this.observer) {
//       this.observer.disconnect();
//     }
//   }
// }
