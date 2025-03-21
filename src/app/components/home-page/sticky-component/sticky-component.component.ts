import {
  Component,
  AfterViewInit,
  OnDestroy,
  QueryList,
  ViewChildren,
  ElementRef,
  Inject,
  PLATFORM_ID,
  signal,
  HostListener,
  effect,
  computed,
  input,
  inject,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';

import { NgClass, NgFor, NgStyle, isPlatformBrowser } from '@angular/common';
import { InViewStickyDirective } from '../../directives/viewDirective';
import { InViewService } from '../../../main-service';
import { TranslationService } from '../../core/lang.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sticky-component',
  standalone: true,
  imports: [NgClass, NgFor, InViewStickyDirective, RouterLink, NgStyle],
  templateUrl: './sticky-component.component.html',
  styleUrl: './sticky-component.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StickyComponentComponent {
  dataText = input<any>();
  data = input<any[]>();
  public translate = inject(TranslationService);
  isBrowser = false;
  removeImage = false;

  private baseAngle = 135;
  scrollFactor = 0;
  rotationAngle = this.baseAngle;

  distanceBig = -1300;
  distancesmall = -260;
  scale = 85;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public service: InViewService,
    private el: ElementRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  downloadImage(url: string): void {
    const fullUrl = `${this.translate.img + url}`; // Construct the full URL
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = url.split('/').pop()!; // Get the file name from the URL
    link.click();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
      });
      this.onWindowResize();
    }
  }
  onWindowResize() {
    if (this.isBrowser) {
      if (window.innerWidth > 768) {
        this.distanceBig = -1300;
        this.distancesmall = -260;
        this.scale = 85;
      } else {
        this.distanceBig = -1600;
        this.distancesmall = -285;
        this.scale = 68;
      }
    }
  }

  // @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.checkSectionScroll();
    }
  }

  private checkSectionScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const distanceFromBottom = window.innerHeight - rect.bottom;
    // const distanceFromTop = window.innerHeight - rect.top;
    // const distanceFromTop = window.innerHeight - rect.top;

    console.log(distanceFromBottom);

    // mog -1600

    if (
      distanceFromBottom >= this.distanceBig &&
      distanceFromBottom <= this.distancesmall
    ) {
      const maxDistance = 1160; // Distance range between -1300 and -140
      const traveledDistance = Math.abs(this.distanceBig - distanceFromBottom); // Positive distance from -1300

      // Calculate scrollFactor as a normalized value within the rotation range
      this.scrollFactor = (traveledDistance / maxDistance) * this.scale; // Scale within 0-305 rotation

      this.updateRotation();
    } else if (distanceFromBottom >= this.distancesmall) {
      this.rotationAngle = 440;
    } else {
      this.rotationAngle = 135;
    }

    if (distanceFromBottom > 490 && distanceFromBottom < 1000) {
      this.removeImage = true;
    } else {
      this.removeImage = false;
    }
  }

  private updateRotation() {
    // console.log(this.scrollFactor);
    // if (this.scrollFactor < 10) {

    this.rotationAngle = this.baseAngle + this.scrollFactor * 4;
    // } else {
    //   // Calculate rotation based on base angle + scroll factor
    //   this.rotationAngle = this.baseAngle + ((this.scrollFactor + 20) * 2);
    // }
  }

  ngOnDestroy() {
    // Remove the event listener to prevent memory leaks
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }
}

// translate(57%, -74px) rotate(492deg)
