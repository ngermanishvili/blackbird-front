import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  UpperCasePipe,
  isPlatformBrowser,
} from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  RouterLink,
} from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { LangComponent } from '../lang/lang.component';
import { TranslationService } from '../core/lang.service';
import { ApiService } from '../core/api-serice';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    LangComponent,
    AsyncPipe,
    RouterLink,
    UpperCasePipe,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @ViewChild('footer') footer!: ElementRef;
  @ViewChild('footerVideo') footerVideo!: ElementRef<HTMLVideoElement>;

  footerHeight = 0;
  footerTransform = 100; // Start the footer off-screen (translateY(100%))
  isAtBottom = false;
  videoError = false;

  @ViewChild('scrollButton') scrollButton!: ElementRef<HTMLButtonElement>;

  currentYear: number = new Date().getFullYear();
  backgroundSize: string = '200px';
  isBrowser: boolean = false;
  showfotterUpSide: boolean = true;
  currentRoute = '';
  $data: Observable<any> = of([]);
  $services: Observable<any> = of([]);
  routelenght = 0;
  private lastUpdate = 0;

  public translate = inject(TranslationService);
  private service = inject(ApiService);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   if (this.isBrowser) {
  //     const footerPosition = this.el.nativeElement.getBoundingClientRect().top;
  //     const windowHeight = window.innerHeight;
  //     if (footerPosition <= windowHeight && footerPosition >= 0) {
  //       const scrollTop = window.scrollY;
  //       const footerHeight = this.el.nativeElement.offsetHeight;
  //       const documentHeight = document.documentElement.scrollHeight;
  //       const footerScrollPercentage =
  //         (scrollTop + windowHeight - documentHeight + footerHeight) /
  //         footerHeight;
  //       const calculateSize = 180 + footerScrollPercentage * 300 + "px"
  //       if (Number(calculateSize.slice(0, -2)) > 180) {
  //         this.backgroundSize = 180 + footerScrollPercentage * 300 + "px";
  //       }
  //     } else {
  //       this.backgroundSize = "400px";
  //     }

  //     // if (this.routelenght === 1) {
  //     //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //     //   const documentHeight = document.documentElement.scrollHeight;

  //     //   // Calculate the distance from the bottom of the page
  //     //   const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

  //     //   const threshold = this.footerHeight / 2; // Trigger the effect when within this distance from the bottom
  //     //   const parallaxFactor = 0.2; // Slower movement factor for smooth transition

  //     //   if (distanceFromBottom <= threshold) {
  //     //     this.isAtBottom = true;

  //     //     // Calculate how much the footer should move up
  //     //     const parallaxDistance = (threshold - distanceFromBottom) * parallaxFactor;
  //     //     this.footerTransform = 100 - Math.min(100, parallaxDistance); // Gradually move footer into view
  //     //   } else {
  //     //     this.isAtBottom = false;
  //     //     this.footerTransform = 100; // Reset footer to off-screen when not near the bottom
  //     //   }
  //     // }

  //   }

  //   // const scrollPosition = window.scrollY;
  //   // // Calculate the bottom space available
  //   // const spaceAtBottom = windowHeight + scrollPosition;

  //   // // Determine how much of the footer to show
  //   // const showAmount = Math.max(0, Math.min(this.footerHeight, this.footerHeight - (spaceAtBottom - this.footerHeight + this.showFooterThreshold)));

  //   // Update the footer position
  //   // if (scrollPosition > this.showFooterThreshold) {
  //   //   this.footer.nativeElement.style.transform = `translateY(${Math.max(0, showAmount)}px)`;
  //   // } else {
  //   //   this.footer.nativeElement.style.transform = `translateY(100%)`;
  //   // }

  // }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((route: any) => {
        const count = route.url.split('/').length - 1;
        this.routelenght = count;
        if (count > 1) {
          this.showfotterUpSide = false;
          this.footerTransform = 0; // Reset footer to off-screen when not near the bottom
        } else {
          this.showfotterUpSide = true;
        }
      });
    this.$data = this.service.getGeneralSettings();
    this.$services = this.service.getServices();

    // if (this.isBrowser) {
    //   window.addEventListener('scroll', () => {
    //     requestAnimationFrame(() => this.updateBackgroundSize());
    //   });
    // }
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.updateBackgroundSize.bind(this));
      });
    }
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      window.removeEventListener(
        'scroll',
        this.updateBackgroundSize.bind(this)
      );
    }
  }

  private updateBackgroundSize() {
    if (this.isBrowser) {
      const footerPosition = this.el.nativeElement.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (footerPosition <= windowHeight && footerPosition >= 0) {
        const scrollTop = window.scrollY;
        const footerHeight = this.el.nativeElement.offsetHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const footerScrollPercentage = Math.min(
          1,
          (scrollTop + windowHeight - documentHeight + footerHeight) /
            footerHeight
        );

        // Linear interpolation for smoother size transition
        const calculatedSize = 180 + footerScrollPercentage * 300;
        this.backgroundSize = `${calculatedSize}px`;
      } else {
        this.backgroundSize = '400px';
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.footerVideo) {
      this.footerVideo.nativeElement.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        this.videoError = true;
      });
    }

    setTimeout(() => {
      this.footerHeight = this.footer.nativeElement.offsetHeight;
    }, 100);

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        this.currentRoute = route.url;

        const count = route.url.split('/').length - 1;

        if (count === 1) {
          this.currentRoute = '/home';
        }
        this.footerTransform = 100; // Reset footer to off-screen when not near the bottom
      }
    });
  }

  // updateBorder(scrollPercentage: number) {
  //   if (this.isBrowser) {

  //     const borderThickness = (scrollPercentage / 100) * 20; // Adjust the 20 to control max border thickness
  //     const borderColor = `rgba(0, 0, 255, ${scrollPercentage / 100})`; // Adjust color as needed

  //     this.scrollButton.nativeElement.style.border = `${borderThickness}px solid ${borderColor}`;
  //   }
  // }
}
