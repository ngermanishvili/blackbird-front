import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  public isBrowser: boolean;
  public currentLang = signal('en'); // Default language
  private sanitizer = inject(DomSanitizer);
  img = 'https://admin.blackbird.ge/storage/';
  scrollReset = signal<any>('enabled');

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private route: ActivatedRoute
  ) {
    // console.log(this.route.snapshot.paramMap.get('lang'));
    this.isBrowser = isPlatformBrowser(this.platformId);
    // if (this.isBrowser && localStorage.getItem('lang')) {
    //   this.currentLang.set(String(localStorage.getItem('lang')));
    // }
  }

  scrollResetFunc(): 'enabled' | 'disabled' {
    return this.scrollReset();
  }

  setLanguage(lang: string) {
    if (lang) {
      if (lang !== localStorage.getItem('lang') && this.isBrowser) {
        localStorage.setItem('lang', lang ?? 'en');
        this.currentLang.set(lang ?? 'en');
      }
    } else {
      localStorage.setItem('lang','en');
      this.currentLang.set('en');
      return;
    }
  }

  getTranslation(key: any): string {
    if (key && typeof key === 'object') {
      return (
        key[this.currentLang()] || key['en'] || 'Translation not available'
      ); // Fallback to English and handle cases where even 'en' might be missing
    }
    return 'Translation not available'; // Handle cases where 'key' is not an object
  }

  getSanitaz(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  getImgSrc(path: string): string {
    if (path && path.includes(this.img)) {
      return path;
    } else {
      return this.img + path;
    }
  }
}
