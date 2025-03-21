import { isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { InViewService } from '../../../main-service';
import { ApiService } from '../../core/api-serice';
import { TranslationService } from '../../core/lang.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  isOpen = false;
  isBrowser = false;

  public service = inject(InViewService)
  public apiService = inject(ApiService)
  public translationService = inject(TranslationService);

}
