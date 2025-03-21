import { Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslationService } from '../core/lang.service';
import { ApiService } from '../core/api-serice';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  $data: Observable<any> = of([])
  $services: Observable<any> = of([])

  public translate = inject(TranslationService)
  private service = inject(ApiService);

  ngOnInit(): void {
    this.$data = this.service.getGeneralSettings()
    this.$services = this.service.getServices()
  }
}
