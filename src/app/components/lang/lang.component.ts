import { Component, Inject, inject, Input, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { TranslationService } from '../core/lang.service';
import { ActivatedRoute, InMemoryScrollingOptions, NavigationStart, Router } from '@angular/router';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-lang',
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
  templateUrl: './lang.component.html',
  styleUrl: './lang.component.scss'
})
export class LangComponent implements OnInit {
  @Input() dark: boolean = false;
  public translationService = inject(TranslationService);
  private router = inject(Router);
  private renderer = inject(Renderer2)

  langDrop = false;
  langItems = [
    { lang: 'ka', text: 'ქა' },
    { lang: 'en', text: 'en' },
    { lang: 'ru', text: 'ru' },
  ];

  langItemsConf = [...this.langItems];

  isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.langDrop = false;
    this.langConfigFunct();

    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');

    if (urlSegments.length > 1) {
      urlSegments[urlSegments.length - 1] = lang;
    }

    const newUrl = urlSegments.join('/');

    // Temporarily disable scroll restoration
    const tempConfig: InMemoryScrollingOptions = {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'enabled',
    };

    this.translationService.scrollReset.set('disabled');


    this.router.navigateByUrl(newUrl, { state: { scrollPositionRestoration: 'enabled' } }).then(() => {
      // Optional: Reset the scroll position if needed
      // window.scrollTo(0, 0);
      this.translationService.scrollReset.set('enabled');



      // Restore scroll restoration to the default enabled behavior
      const defaultConfig: InMemoryScrollingOptions = {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      };
    });
  }


  langConfigFunct() {
    this.langItems = this.langItemsConf.filter(
      (item) => item.lang !== this.translationService.currentLang()
    );
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.router.events.subscribe((route) => {
        if (route instanceof NavigationStart) {
          const mainRoute = route.url.split('/').pop();
          const lang = mainRoute ?? 'en';
          this.translationService.setLanguage(lang);
          this.renderer.setAttribute(document.documentElement, 'lang', lang);
          this.langConfigFunct();
        }
      })
    }
  }

  toggleLang() {
    this.langDrop = !this.langDrop;
  }
}
