import { Component, inject, Inject, input, Input, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { servicesData } from '../../services.array';
import { isPlatformBrowser, NgStyle } from '@angular/common';
import { TranslationService } from '../../../core/lang.service';
@Component({
  selector: 'app-service-item',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './service-item.component.html',
  styleUrl: './service-item.component.scss'
})
export class ServiceItemComponent {
  data = input<string>();
  private isBrowser!: boolean;
  public service = servicesData[0];
  public translate = inject(TranslationService)
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  ngOnInit(): void {
    let routerActive = this.router.url.split('/').pop()
    if (this.isBrowser) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((route: any) => {
        routerActive = route.urlAfterRedirects;
      });
    }
    // this.service = servicesData.filter(item => item.name === routerActive)[0];
  }
}
