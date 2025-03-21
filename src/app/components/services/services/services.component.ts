import { Component, HostListener, inject, NgZone } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { serviceRoutes } from '../services.array';
import { AlsoCheckComponent } from '../components/also-check/also-check.component';
import { LogosComponent } from '../../logos/logos.component';
import { WizardsComponent } from '../../home-page/wizards/wizards.component';
import { ServiceItemComponent } from '../components/service-item/service-item.component';
import { filter, Subject, takeUntil } from 'rxjs';
import { TrackSectionScrollDirective } from '../../directives/test';
import { ServicePageItemComponent } from '../components/service-page-item/service-page-item.component';
import { TranslationService } from '../../core/lang.service';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ApiService } from '../../core/api-serice';
import { HoverBlockComponent } from '../../hover-block/hover-block.component';
import { HardScrollComponent } from '../components/hard-scroll/hard-scroll.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    AlsoCheckComponent,
    LogosComponent,
    WizardsComponent,
    ServiceItemComponent,
    ServicePageItemComponent,
    TrackSectionScrollDirective,
    HardScrollComponent,
    HoverBlockComponent,
    NgFor,
    NgStyle,
    NgClass,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  unsubscribe$: Subject<void> = new Subject();
  public services: any[] = [];
  public serviceItems: any[] = [];
  public exactService: any = {};
  loaded = false;
  serviceLoade = false;
  windowWidrth = 0;
  private route = inject(ActivatedRoute);
  public translate = inject(TranslationService);
  private service = inject(ApiService);
  private ngZone = inject(NgZone);
  initialTopGap = 410;
  initialBottomGap = this.windowWidrth <= 768 ? 100 : 300;
  gapIncrement = 20;
  style: boolean = false;

  ngOnInit(): void {
    let id = '';
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((rout: any) => {
        id = rout.params.id;
        this.getData(id);
      });

    this.onResize();
    this.exactService?.whats_included?.items.map((item: any, index: any) => ({
      ...item, // Preserve existing properties
      zindex: index,
      topGap: this.initialTopGap + this.gapIncrement * index, // Calculate and assign topGap
    }));

    setTimeout(() => {
      this.loaded = true;
    }, 1000);
    if (this.translate.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        //   window.addEventListener('resize', this.onResize.bind(this));
        //   this.scrollHandler = this.onScroll.bind(this);
        window.addEventListener('resize', this.onResize.bind(this));
      });
    }
  }

  getData(id?: any) {
    this.serviceLoade = false;
    this.service
      .getServices()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.services = res['data'];
      });
    this.service
      .getService(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        res.whats_included.items = res?.whats_included?.items?.map(
          (item: any, index: number) => ({
            ...item, // Preserve existing properties
            zindex: 1000 - index,
            topSticky: index * 100,
            topGap: this.initialTopGap + this.gapIncrement * index, // Calculate and assign topGap
          })
        );
        this.exactService = res;
        this.style = res['style'] === 'style-1' ? true : false;
        this.serviceLoade = true;
      });
  }

  // ngAfterContentChecked(): void {
  //   setTimeout(() => {
  //     this.loaded = true
  //   }, 100);
  // }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.translate.isBrowser) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  // @HostListener('window:resize', [])
  onResize() {
    if (this.translate.isBrowser) {
      this.windowWidrth = window.innerWidth;
      this.initialBottomGap = this.windowWidrth <= 768 ? -200 : 100;

      // if (window.innerWidth <= 768 ) {
      //   this.exactService?.whats_included?.items?.map(
      //     (item: any) => (item.topGap = Number(item.topGap) + 750)
      //   );
      // }
    }
  }
}
