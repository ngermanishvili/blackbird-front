import { Component, Inject, inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { servicesData } from '../../services/services.array';
import { AsyncPipe, isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api-serice';
import { Observable } from 'rxjs';
import { TranslationService } from '../../core/lang.service';
import { count } from 'console';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-succes-cases',
  standalone: true,
  imports: [NgFor, NgClass, RouterLink, AsyncPipe, PaginationComponent],
  templateUrl: './succes-cases.component.html',
  styleUrl: './succes-cases.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class SuccesCasesComponent {
  // public services = servicesData;
  public activeFilter = 'all'
  service = inject(ApiService);
  $services = this.service.getServices();
  public translateService = inject(TranslationService);
  loading = false;
  succeses: any;
  isBrowser = false;
  page = 1

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  onClickFilter(item?: any) {
    this.activeFilter = item?.slug ?? 'all';
    this.page = 1;
    if (item) {
      this.getData(item?.id ?? '')
    } else {
      this.getData()
    }
  }

  ngOnInit(): void {
    this.getData()
  }

  getData(serviceId?: string): any {
    this.service.getCaseStudies(this.page, serviceId).subscribe((res) => {
      this.succeses = res;
    })
  }

  onPageChange(page: number): void {
    this.page = page
    this.getData();
    setTimeout(() => {
      this.gotoTop()
    }, 100);
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

  // onScroll(): void {
  //   const threshold = 300;
  //   const position = window.innerHeight + window.scrollY;
  //   const maxScroll = document.documentElement.scrollHeight;

  //   if (position + threshold >= maxScroll && !this.loading) {
  //     this.loading = true;
  //     this.loadMoreItems();
  //   }
  // }

  // loadMoreItems(): void {
  //   setTimeout(() => {
  //     this.getData()
  //     this.loading = false;
  //   }, 100);
  // }

  // ngOnDestroy() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     window.removeEventListener('scroll', this.onScroll.bind(this));
  //   }
  // }

}
