import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {AlsoCheckComponent} from '../../services/components/also-check/also-check.component';
import {LogosComponent} from '../../logos/logos.component';
import {BrandingComponent} from '../branding/branding.component';
import {FoundersComponent} from '../founders/founders.component';
import {Observable, of} from 'rxjs';
import {ApiService} from '../../core/api-serice';
import {TranslationService} from '../../core/lang.service';
import {AsyncPipe, isPlatformBrowser, NgClass} from '@angular/common';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AlsoCheckComponent, LogosComponent, BrandingComponent, FoundersComponent, AsyncPipe, NgClass],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class AboutComponent implements AfterViewInit {
  $data: Observable<any> = of(null)
  isBrowser: boolean = false;
  public service = inject(ApiService);
  public translate = inject(TranslationService);

  ngOnInit(): void {
    this.$data = this.service.getAbout();
  }

  constructor( @Inject(PLATFORM_ID) platformId: Object,) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  @ViewChild('scrollElement') scrollElement!: ElementRef;
  @ViewChild('scrollSection') scrollSection!: ElementRef;

  ngAfterViewInit(): void {
    this.initScrollAnimation();
  }

  initScrollAnimation() {
    const overlay = this.scrollElement.nativeElement;
    const scrollSection = this.scrollSection.nativeElement;

    // Create the scroll animation for clip-path
    ScrollTrigger.create({
      trigger: scrollSection, // Trigger the animation when the section enters the viewport
      start: 'top bottom', // Start animation when the section enters the viewport
      end: 'bottom top', // End animation when the section leaves the viewport
      scrub: true, // Smooth animation tied to scroll progress
      animation: this.animateClipPath(overlay),
      markers: false // Set to true for debugging
    });
  }

  animateClipPath(overlay: any) {
    return gsap.timeline()
      .fromTo(
        overlay.querySelector('img'),
        { clipPath: 'inset(0% 25% 0% 25%)' }, // Initial clip-path (clipped)
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'linear' } // Fully reveal the image
      );
  }

}
