import {
  AsyncPipe,
  isPlatformBrowser,
  NgClass,
  NgFor,
  NgIf,
  NgStyle,
} from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Inject,
  NgZone,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { debounceTime, Observable, of, Subject } from 'rxjs';
import { TranslationService } from '../../core/lang.service';
import { LangComponent } from '../../lang/lang.component';
import { ApiService } from '../../core/api-serice';
import { InViewService } from '../../../main-service';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterModule,
    NgFor,
    NgIf,
    LangComponent,
    AsyncPipe,
    ContactComponent,
    NgStyle,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('resizableDiv') resizableDiv!: ElementRef;
  @ViewChild('staticdiv') staticDiv!: ElementRef;

  isBrowser: boolean = false;
  scrollTop: boolean = false;
  loaded = signal(false);
  activeHoverItem: string = 'Home';
  currentRoute = signal<string>('home');
  routeCount = 0;
  contentItems = [{}, {}, {}, {}, {}];
  $general: Observable<any> = of([]);
  $services: Observable<any> = of([]);
  hasScrolledDown: boolean = false;
  firstScrollDone: boolean = false;

  private service = inject(ApiService);

  private previousScrollTop = 0;
  public hdieHeader = false;
  public fastScrolling = false;
  public navMenu: boolean = false;
  public translationService = inject(TranslationService);
  $data: Observable<any> = of();
  windowWidth: any = 0;
  bgImage = '';

  private scrollEvent$ = new Subject<void>();
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private servicee: InViewService,
    private router: Router,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.scrollEvent$
      .pipe(
        debounceTime(100) // Adjust the debounce time as needed
      )
      .subscribe(() => {
        this.checkScrollPosition();
      });
    effect(
      () => {
        this.updateLoaded();
      },
      { allowSignalWrites: true }
    );
  }

  updateLoaded() {
    this.loaded.set(this.servicee.loaded());
  }

  // @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.updateHeight();
  }
  // @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (this.isBrowser) {
      this.windowWidth = window.innerWidth;
    }
  }

  onClickRoute() {
    if (this.routeCount > 1) {
      this.router.navigate(['/']);
    }
  }

  toggleNav() {
    this.navMenu = !this.navMenu;
    if (this.navMenu) {
      this.activeHover('Home');
      this.servicee.hideSCroll();
    } else {
      this.servicee.showScroll();
      setTimeout(() => {
        this.activeHover('');
      }, 1000);
    }
  }

  activeHover(item: string) {
    this.activeHoverItem = item;
  }

  checkScrollPosition() {
    if (this.isBrowser) {
      if (window.scrollY > 0) {
        this.scrollTop = true;
      } else {
        this.scrollTop = false;
      }
    }
  }

  updateHeight() {
    if (this.isBrowser) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > this.previousScrollTop && scrollTop > 310) {
        this.hdieHeader = true;
      } else if (scrollTop < this.previousScrollTop) {
        this.hdieHeader = false;
      }
      if (scrollTop > 10) {
        this.scrollTop = true;
      }
      this.previousScrollTop = scrollTop;
    }
  }

  ngOnInit(): void {
    this.onWindowResize();
    this.$general = this.service.getGeneralSettings();
    this.$services = this.service.getServices();
    this.$data = this.service.gethomeData();
    this.updateHeight();
    this.checkScrollPosition();

    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        //   window.addEventListener('resize', this.onResize.bind(this));
        //   this.scrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this));
      });
    }
  }

  ngAfterContentInit(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        const count = route.url.split('/').length - 1;
        this.routeCount = count;
        if (count === 1) {
          this.currentRoute.set('home');
          // this.scrollTop = false;
        } else {
          this.scrollTop = true;
          this.currentRoute.set(String(route.url.substring(1)));
        }
      }
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.isBrowser) {
      window.removeEventListener('resize', this.onWindowResize.bind(this));
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }
}
