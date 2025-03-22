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
      localStorage.setItem('lang', 'en');
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

  /**
   * Get the image alt text with a fallback to default value
   * @param item The image object containing potential alt attribute
   * @param defaultAlt Default alt text to use if none is provided
   * @returns The alt text for the image
   */
  getImageAlt(item: any, defaultAlt: string = 'Blackbird image'): string {
    if (!item) return defaultAlt;

    // Handle different naming conventions for alt attributes
    const altOptions = [
      item.alt,
      item.image_alt,
      item.main_image_alt,
      item[`${this.currentLang()}_alt`],
      item.alt?.[this.currentLang()],
      item.image_alt?.[this.currentLang()]
    ];

    // Return the first non-empty alt or default
    for (const alt of altOptions) {
      if (alt && typeof alt === 'string' && alt.trim() !== '') {
        return alt;
      } else if (alt && typeof alt === 'object') {
        const translatedAlt = this.getTranslation(alt);
        if (translatedAlt !== 'Translation not available') {
          return translatedAlt;
        }
      }
    }

    // If no alt found, generate one based on other properties
    if (item.name) {
      return this.getTranslation(item.name);
    } else if (item.title) {
      return this.getTranslation(item.title);
    }

    return defaultAlt;
  }

  /**
   * Get the image title with a fallback to default value
   * @param item The image object containing potential title attribute
   * @param defaultTitle Default title text to use if none is provided
   * @returns The title text for the image
   */
  getImageTitle(item: any, defaultTitle: string = 'Blackbird'): string {
    if (!item) return defaultTitle;

    // Handle different naming conventions for title attributes
    const titleOptions = [
      item.title,
      item.image_title,
      item.main_image_title,
      item[`${this.currentLang()}_title`],
      item.title?.[this.currentLang()],
      item.image_title?.[this.currentLang()]
    ];

    // Return the first non-empty title or default
    for (const title of titleOptions) {
      if (title && typeof title === 'string' && title.trim() !== '') {
        return title;
      } else if (title && typeof title === 'object') {
        const translatedTitle = this.getTranslation(title);
        if (translatedTitle !== 'Translation not available') {
          return translatedTitle;
        }
      }
    }

    // If no title found, generate one based on other properties
    if (item.name) {
      return this.getTranslation(item.name);
    } else if (item.title) {
      return this.getTranslation(item.title);
    }

    return defaultTitle;
  }
}
