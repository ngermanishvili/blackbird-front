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
        if (event.url === '/home') {
          this.titleService.setTitle('blackbird');
          this.metaService.updateTag({ name: 'blackbird' });
        } else if (event.url === '/about') {
          this.titleService.setTitle('about-blackbird');
          this.metaService.updateTag({ name: 'about blackbird' });
        } else if (event.url === '/contact') {
          this.titleService.setTitle('contact-blackbird');
          this.metaService.updateTag({ name: 'blackbird contact' });
        } else if (event.url.includes('services')) {
          this.titleService.setTitle('blackbird-services');
          this.metaService.updateTag({ name: 'blackbird services' });
        }
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
