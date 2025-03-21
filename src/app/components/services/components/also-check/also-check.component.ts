import { Component, inject, input, Input, ViewEncapsulation } from '@angular/core';
import { serviceRoutes, servicesData } from '../../services.array';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/api-serice';
import { TranslationService } from '../../../core/lang.service';

@Component({
  selector: 'app-also-check',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './also-check.component.html',
  styleUrl: './also-check.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AlsoCheckComponent {
  @Input() hasHeader?: boolean = true;
  @Input() titleData: any;
  data = input<string>();

  private translate = inject(TranslationService);
  public services = servicesData.filter(
    (item) => item.name !== this.router.url.split('/').pop()
  );
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        this.services = servicesData.filter(
          (item) => item.name !== this.router.url.split('/').pop()
        );
      }
    });
  }

  ngAfterViewInit(): void {
    // console.log(this.data());
  }
}
