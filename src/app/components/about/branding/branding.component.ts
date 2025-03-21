import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/lang.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class BrandingComponent {
  data = input<any>();
  public translate = inject(TranslationService)

}
