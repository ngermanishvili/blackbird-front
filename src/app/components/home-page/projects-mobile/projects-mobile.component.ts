import { NgClass } from '@angular/common';
import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InViewDirective } from "../../directives/scroll-directive";
import { TranslationService } from '../../core/lang.service';

@Component({
  selector: 'app-projects-mobile',
  standalone: true,
  imports: [InViewDirective, NgClass, RouterLink],
  templateUrl: './projects-mobile.component.html',
  styleUrl: './projects-mobile.component.scss',
  encapsulation: ViewEncapsulation.None,

})
export class ProjectsMobileComponent {
  data = input<any>()
  public translate = inject(TranslationService)

  isInview: boolean = false
  onInView(inView: boolean): void {
    setTimeout(() => {
      this.isInview = inView;
    }, 4000);
  }
}
