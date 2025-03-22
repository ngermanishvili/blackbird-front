import { NgClass, NgIf, isPlatformBrowser } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  HostListener,
  Inject,
  NgZone,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { InViewService } from './main-service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/home-page/header/header.component';

import { Meta, Title } from '@angular/platform-browser';
import { ApiService } from './components/core/api-serice';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslationService } from './components/core/lang.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  scrollEvent: Event | null = null;
  isBrowser: boolean = false;
  scrollTopSignal = signal(0);
  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', Validators.required),
  });
  private router = inject(Router);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  public apiService = inject(ApiService);
  public translateService = inject(TranslationService);

  scrollPercentage: number = 0;
  loader = false;
  progress = 0;
  pageActive = true;
  error: string | null = '';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    public service: InViewService,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.handleScrollRestoration();
      });
  }

  handleScrollRestoration() {
    if (this.isBrowser) {
      const shouldResetScroll = this.translateService.scrollReset();
      if (shouldResetScroll === 'disabled') {
        window.history.scrollRestoration = 'manual';
      } else {
        window.history.scrollRestoration = 'auto';
        this.gotoTop('instant');
      }
    }
  }

  scrollResetFunc(): 'enabled' | 'disabled' {
    return this.translateService.scrollReset();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        // window.addEventListener('resize', this.onResize.bind(this));
        // this.scrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
      });
    }

    this.onWindowScroll();
    if (this.isBrowser && this.pageActive) {
      this.simulateProgress();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Extract the current page from URL
        let currentPage = 'home';

        if (event.url === '/home' || event.url === '/') {
          currentPage = 'home';
        } else if (event.url === '/about') {
          currentPage = 'about';
        } else if (event.url === '/contact') {
          currentPage = 'contact';
        } else if (event.url.includes('services')) {
          currentPage = 'services';
        } else if (event.url.includes('work')) {
          currentPage = 'case-studies';
        }

        // Get SEO data for the current page
        this.apiService.getSeoData(currentPage).subscribe(response => {
          if (response.success && response.data) {
            const currentLang = this.translateService.currentLang();

            // Check if translations exist for current language, otherwise use meta
            let seoData;
            if (response.data.translations &&
              response.data.translations[currentLang] &&
              Object.keys(response.data.translations[currentLang]).length > 0) {
              seoData = response.data.translations[currentLang];
            } else if (response.data.meta && Object.keys(response.data.meta).length > 0) {
              seoData = response.data.meta;
            } else {
              console.warn('No SEO data available for', currentPage);
              return;
            }

            // Set title
            if (seoData.title) {
              this.titleService.setTitle(seoData.title);
            }

            // Set meta tags
            if (seoData.description) {
              this.metaService.updateTag({ name: 'description', content: seoData.description });
            }

            if (seoData.keywords) {
              this.metaService.updateTag({ name: 'keywords', content: seoData.keywords });
            }

            // Set Open Graph meta tags
            if (seoData.og_title) {
              this.metaService.updateTag({ property: 'og:title', content: seoData.og_title });
            }

            if (seoData.og_description) {
              this.metaService.updateTag({ property: 'og:description', content: seoData.og_description });
            }

            if (seoData.og_image) {
              this.metaService.updateTag({ property: 'og:image', content: seoData.og_image });
            }

            // Set Twitter Card meta tags if present
            if (seoData.twitter_card) {
              this.metaService.updateTag({ name: 'twitter:card', content: seoData.twitter_card });
            }

            if (seoData.twitter_title) {
              this.metaService.updateTag({ name: 'twitter:title', content: seoData.twitter_title });
            }

            if (seoData.twitter_description) {
              this.metaService.updateTag({ name: 'twitter:description', content: seoData.twitter_description });
            }

            if (seoData.twitter_image) {
              this.metaService.updateTag({ name: 'twitter:image', content: seoData.twitter_image });
            }
          }
        });
      }
    });
    if (this.isBrowser) {
      setTimeout(() => {
        this.gotoTop('instant');
        const head = document.getElementById('head');
        head?.scrollTo(0, 0);

        const element = document.getElementById('head');
        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 1000);
    }
  }

  submitForm() {
    this.apiService.postContactUs(this.contactForm.getRawValue()).subscribe(
      (contact) => {
        this.error = null;
        this.contactForm.reset();
        this.service.toggleOpen(false);
      },
      (errors) => (this.error = errors?.error?.message ?? errors?.message)
    );
  }

  simulateProgress() {
    this.zone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        this.progress += 10;
        if (this.progress >= 100) {
          clearInterval(interval);
          this.zone.run(() => {
            setTimeout(() => {
              this.loader = true;
              document.body.style.overflow = 'auto';
              this.service.loaded.set(true);
            }, 1000);
          });
        }
      }, 100); // Adjust the interval time for smoother or faster progress
    });
  }

  // @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser && this.pageActive) {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      this.scrollPercentage = (winScroll / height) * 100;
    }
  }

  gotoTop(scrollBehavior: ScrollBehavior = 'smooth') {
    if (this.isBrowser) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: scrollBehavior,
      });
    }
  }

  ngOnDestroy(): void {
    this.gotoTop('instant');
    this.pageActive = false;
  }
}
