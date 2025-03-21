import { Component, inject, input } from '@angular/core';
import { TranslationService } from '../core/lang.service';

@Component({
  selector: 'app-logos',
  standalone: true,
  imports: [],
  templateUrl: './logos.component.html',
  styleUrl: './logos.component.scss'
})
export class LogosComponent {
  data = input<any[]>([]);
  public translate = inject(TranslationService)

}
