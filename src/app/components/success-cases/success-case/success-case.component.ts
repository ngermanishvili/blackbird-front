import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api-serice';
import { Observable } from 'rxjs';
import { TranslationService } from '../../core/lang.service';
import { AsyncPipe, JsonPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { InViewService } from '../../../main-service';

@Component({
  selector: 'app-success-case',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgFor, JsonPipe, NgIf, SlicePipe],
  templateUrl: './success-case.component.html',
  styleUrl: './success-case.component.scss'
})
export class SuccessCaseComponent {
  service = inject(ApiService);
  route = inject(ActivatedRoute)
  public translateService = inject(TranslationService);
  public mainService = inject(InViewService);
  id = '';
  $data!: Observable<any>

  isPopupVisible = false;
  currentImageIndex = 0;
  images: any[] = []
  currentImage = this.images[0];

  ngOnInit(): void {
    this.translateService.getTranslation
    this.id = String(this.route.snapshot.paramMap.get('id'))

    this.$data = this.service.getCaseStudy(String(this.route.snapshot.paramMap.get('id')))
    this.$data.subscribe((res) => {
      this.images = res.gallery;
      this.currentImage = this.images[0];
    })
  }

  openImagePopup(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.images[this.currentImageIndex];
    this.isPopupVisible = true;
    this.mainService.hideSCroll()
  }

  closePopup() {
    this.isPopupVisible = false;
    this.mainService.showScroll()
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.currentImage = this.images[this.currentImageIndex];
  }

  prevImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.currentImage = this.images[this.currentImageIndex];
  }

  hasItem(item: any) {
    if (item.content.text) {
      return true
    } else {
      return false
    }
  }
}
