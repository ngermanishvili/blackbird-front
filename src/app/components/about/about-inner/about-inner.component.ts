import { Component, inject, ViewEncapsulation } from '@angular/core';
import { AlsoCheckComponent } from '../../services/components/also-check/also-check.component';
import { AsyncPipe, NgClass, NgFor, NgStyle } from '@angular/common';
import { serviceRoutes } from '../../services/services.array';
import { RouterLink } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from '../../core/api-serice';
import { TranslationService } from '../../core/lang.service';

@Component({
  selector: 'app-about-inner',
  standalone: true,
  imports: [AlsoCheckComponent, NgStyle, NgFor, NgClass, RouterLink, AsyncPipe],
  templateUrl: './about-inner.component.html',
  styleUrl: './about-inner.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AboutInnerComponent {
  brandBirds = serviceRoutes;
  activeBird: any;
  $data: Observable<any> = of(null)

  private service = inject(ApiService);
  public translate = inject(TranslationService);

  activeItem(item: any) {
    this.activeBird = item;
  }

  ngOnInit(): void {
    this.$data = this.service.getAboutInner();
    this.$data.subscribe((res) => {
      this.activeItem(res['services'][0])
    })
  }

  getStyles(item: { branding_icon: string, color: string }) {
    return {
      'background-image': `url('${this.translate.getImgSrc(item.branding_icon)}')`,
      'background-color': item.color
    };
  }
}
