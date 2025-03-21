import { Component, inject, input } from '@angular/core';
import { TranslationService } from '../core/lang.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hover-block',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hover-block.component.html',
  styleUrl: './hover-block.component.scss'
})
export class HoverBlockComponent {
  data = input<any[]>();
  public translate = inject(TranslationService);
}
