import { Component, inject, input, Input } from '@angular/core';
import { InViewDirective } from '../../../directives/scroll-directive';
import { TrackScrollDirective } from '../../../directives/wiewInWindow';
import { NgStyle } from '@angular/common';
import { TranslationService } from '../../../core/lang.service';
import { RouterLink } from '@angular/router';
import {InViewService} from "../../../../main-service";

@Component({
  selector: 'app-service-page-item',
  standalone: true,
  imports: [TrackScrollDirective,
    NgStyle,
    RouterLink,
  ],
  templateUrl: './service-page-item.component.html',
  styleUrl: './service-page-item.component.scss'
})
export class ServicePageItemComponent {
  @Input() activeClass?: string;
  @Input() elementTop?: number;
  @Input() scrollThresholdBottom?: number;
  data = input<any>()
  public translate = inject(TranslationService)
  public service = inject(InViewService)


}
