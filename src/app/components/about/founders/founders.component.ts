import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  Inject,
  input,
  NgZone,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { TranslationService } from '../../core/lang.service';
import { InViewService } from '../../../main-service';
import { ApiService } from '../../core/api-serice';

@Component({
  selector: 'app-founders',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './founders.component.html',
  styleUrl: './founders.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FoundersComponent {
  slides = [
    {
      id: 1,
      name: 'Tamuna Rostiashvili',
      job: 'CEO',
      text: 'When you run your hand along the weathered, amber-hued wooden pillars or when youre enveloped in the delightful scent of wooden structures, have you ever considered the mountains where the trees grew? Well-maintained forests nurture essential nutrients and minerals for all forms of',
    },
    {
      id: 2,
      name: 'Tamuna Rostiashvili',
      job: 'CEO',
      text: 'When you run your hand along the weathered, amber-hued wooden pillars or when youre enveloped in the delightful scent of wooden structures, have you ever considered the mountains where the trees grew? Well-maintained forests nurture essential nutrients and minerals for all forms of',
    },
    {
      id: 3,
      name: 'Tamuna Rostiashvili',
      job: 'CEO',
      text: 'When you run your hand along the weathered, amber-hued wooden pillars or when youre enveloped in the delightful scent of wooden structures, have you ever considered the mountains where the trees grew? Well-maintained forests nurture essential nutrients and minerals for all forms of',
    },
    {
      id: 4,
      name: 'Tamuna Rostiashvili',
      job: 'CEO',
      text: 'When you run your hand along the weathered, amber-hued wooden pillars or when youre enveloped in the delightful scent of wooden structures, have you ever considered the mountains where the trees grew? Well-maintained forests nurture essential nutrients and minerals for all forms of',
    },
    {
      id: 5,
      name: 'Tamuna Rostiashvili',
      job: 'CEO',
      text: 'When you run your hand along the weathered, amber-hued wooden pillars or when youre enveloped in the delightful scent of wooden structures, have you ever considered the mountains where the trees grew? Well-maintained forests nurture essential nutrients and minerals for all forms of',
    },
  ];
  horizontalScrollContainer!: HTMLElement;
  isHorizontalScrollActive = false;
  isBrowser: boolean;
  lastScrollLeft = 0;
  windowiSize: number = 0;
  data = input<any[]>([]);
  firstElement = computed(() => this.data()?.[0] || null);

  title = input<any>('');
  public translate = inject(TranslationService);
  public apiService = inject(ApiService);
  private service = inject(InViewService);
  private readonly horizontalScrollHandlerBound: (event: WheelEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.horizontalScrollHandlerBound = this.horizontalScrollHandler.bind(this);
  }
  ngAfterViewInit() {
    if (this.isBrowser) {
      this.horizontalScrollContainer = document.querySelector(
        '.horizontal-scroll-container'
      ) as HTMLElement;
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.deactivateHorizontalScroll();
      this.service.showScroll();
      window.removeEventListener('resize', this.onResize.bind(this));
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }
  // @HostListener('window:resize', [])
  onResize() {
    if (this.isBrowser) {
      this.windowiSize = window.innerWidth;
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.isBrowser) {
      this.zone.runOutsideAngular(() => {
        // window.addEventListener('resize', this.onResize.bind(this));
        // this.scrollHandler = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onWindowScroll.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
      });
    }
  }

  // @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      if (this.windowiSize > 1200) {
        const rect = this.horizontalScrollContainer.getBoundingClientRect();
        let isInViewport = false;

        // Check if the element is within the viewport range (between -150 and 150 from the top)
        if (rect.top < 150 && rect.top > -5) {
          isInViewport = true;
        }

        if (isInViewport && !this.isHorizontalScrollActive) {
          this.isHorizontalScrollActive = true;
          this.preventPageScroll();
        } else if (!isInViewport && this.isHorizontalScrollActive) {
          this.isHorizontalScrollActive = false;
          this.allowPageScroll();
        }
      }
      this.windowiSize = window.innerWidth;
    }
  }

  private preventPageScroll() {
    if (this.isBrowser) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      this.service.hideSCroll();
      (window as Window).addEventListener(
        'wheel',
        this.horizontalScrollHandlerBound,
        { passive: false }
      );
    }
  }
  private allowPageScroll() {
    if (this.isBrowser) {
      this.service.showScroll();
      (window as Window).removeEventListener(
        'wheel',
        this.horizontalScrollHandlerBound
      );
    }
  }

  private horizontalScrollHandler(event: WheelEvent) {
    if (this.isHorizontalScrollActive && this.isBrowser) {
      // event.preventDefault();
      const delta = Math.sign(event.deltaY);
      const newScrollLeft =
        this.horizontalScrollContainer.scrollLeft + delta * 20; // Adjust the scroll speed as needed

      if (newScrollLeft <= 0) {
        this.horizontalScrollContainer.scrollLeft = 0;
        this.allowPageScroll(); // Allow page scroll when reaching the left end (scrolling up)
      } else if (
        newScrollLeft >=
        this.horizontalScrollContainer.scrollWidth - window.innerWidth
      ) {
        this.horizontalScrollContainer.scrollLeft =
          this.horizontalScrollContainer.scrollWidth - window.innerWidth;
        this.allowPageScroll(); // Allow page scroll when reaching the right end (scrolling down)
      } else {
        this.horizontalScrollContainer.scrollLeft = newScrollLeft;
      }

      this.lastScrollLeft = newScrollLeft;
    }
  }

  private deactivateHorizontalScroll() {
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
      (window as Window).removeEventListener(
        'wheel',
        this.horizontalScrollHandlerBound
      );
    }
  }
}
