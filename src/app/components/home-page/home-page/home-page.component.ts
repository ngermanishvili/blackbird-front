import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  isPlatformBrowser,
} from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  HostListener,
  Inject,
  ModuleWithProviders,
  NgZone,
  PLATFORM_ID,
  Renderer2,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ProjectsComponent } from '../projects/projects.component';
import { InViewDirective } from '../../directives/scroll-directive';
import { WizardsComponent } from '../wizards/wizards.component';
import { StickyComponentComponent } from '../sticky-component/sticky-component.component';
import { LogosComponent } from '../../logos/logos.component';
import { ProjectsMobileComponent } from '../projects-mobile/projects-mobile.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../core/api-serice';
import { TranslationService } from '../../core/lang.service';
import { Observable, of } from 'rxjs';
import { SplitArrayPipe } from '../../pipes/array-split.pipe';
import { HeroComponent } from '../hero/hero.component';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    StickyComponentComponent,
    NgFor,
    NgIf,
    WizardsComponent,
    InViewDirective,
    ProjectsComponent,
    ProjectsMobileComponent,
    FooterComponent,
    NgClass,
    HeaderComponent,
    LogosComponent,
    AsyncPipe,
    SplitArrayPipe,
    HeroComponent,
  ],
  // exportAs: 'HomePageComponent',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  providers: [HttpClientModule, RouterLink],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent {
  scrollEvent: Event | null = null;
  isBrowser: boolean = false;
  scrollTopSignal = signal(0);
  scrollPercentage: number = 0;
  pageActive = true;
  service = inject(ApiService);
  public $data: Observable<any> = of();
  public translationService = inject(TranslationService);
  animTextArrays = {};
  private cachedArray: any[] | null = null;

  items: { id: number; text: string }[] = [
    {
      id: 1,
      text: 'Gorenje',
    },
    {
      id: 1,
      text: 'Gorenje',
    },
    {
      id: 1,
      text: 'Samsung',
    },
    {
      id: 1,
      text: 'Gorenje',
    },
    // {
    //   id: 1,
    //   text: "Gorenje",
    // },
    // {
    //   id: 1,
    //   text: "Gorenje",
    // },
  ];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.onWindowScroll();
    this.$data = this.service.gethomeData();
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
      });
    }
  }

  onWindowScroll() {
    if (this.isBrowser && this.pageActive) {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      this.scrollPercentage = (winScroll / height) * 100;
    }
  }

  gotoTop() {
    if (this.isBrowser) {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  ngOnDestroy(): void {
    this.pageActive = false;
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }
}
