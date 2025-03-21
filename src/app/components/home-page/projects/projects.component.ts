import { Component, inject, input, ViewEncapsulation } from "@angular/core";
import { InViewDirective } from "../../directives/scroll-directive";
import { NgClass, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslationService } from "../../core/lang.service";

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [InViewDirective, NgClass, RouterLink, NgIf],
  templateUrl: "./projects.component.html",
  styleUrl: "./projects.component.scss",
  encapsulation: ViewEncapsulation.None,
})
export class ProjectsComponent {
  data = input<any>();
  public translate = inject(TranslationService)
  isInview: boolean = false
  onInView(inView: boolean): void {
    setTimeout(() => {
      this.isInview = inView;
    }, 1000);
  }
}
