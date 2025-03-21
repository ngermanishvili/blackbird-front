import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InViewService {
  public elementIndices = signal<string[]>([]);
  public loaded = signal(false);
  public contactPopup = signal(false);
  isMacBook: boolean = false;

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  detectMacBook() {
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMacBook =
      /macintosh|mac os x/.test(userAgent) && !/mobile/.test(userAgent);

    if (this.isMacBook) {
      console.log('You are on a MacBook.');
    } else {
      console.log('You are not on a MacBook.');
    }
  }

  addElementIndex(index: string) {
    this.elementIndices.update((indexes) => {
      // Check if the index is already present before adding
      if (!indexes.includes(index)) {
        return [...indexes, index];
      }
      return indexes;
    });
  }

  removeElementIndex(index: string) {
    this.elementIndices.update((indexes) => {
      // Only remove the index if it exists
      return indexes.filter((existingIndex) => existingIndex !== index);
    });
  }


  getStickyElementIndices() {
    return this.elementIndices;
  }

  toggleOpen(bool: boolean) {
    if (this.isBrowser) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (bool) {
        this.hideSCroll();
      } else {
        this.showScroll();
      }
      this.contactPopup.set(bool);
    }
  }

  hideSCroll() {
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
      if (!isIOS()) {
        document.body.style.paddingRight = `15px`;
        document.body.classList.add('hideSCroll');
      }
    }
  }

  showScroll() {
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
      if (!isIOS()) {
        document.body.style.paddingRight = '0px';
        document.body.classList.remove('hideSCroll');
      }
    }
  }
}

function isIOS() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  // It's a macOS device if it's "Mac" but not iOS
  return isMac || !isiOS;
}
