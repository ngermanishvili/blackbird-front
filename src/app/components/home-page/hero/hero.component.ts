import { isPlatformBrowser, NgClass, NgStyle } from '@angular/common';
import { Component, effect, Inject, inject, PLATFORM_ID, signal } from '@angular/core';
import { InViewService } from '../../../main-service';
import { TranslationService } from '../../core/lang.service';
import { ApiService } from '../../core/api-serice';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  data = signal([])
  loaded = signal(false);
  private servicee = inject(InViewService)
  public translationService = inject(TranslationService);
  private service = inject(ApiService);
  bgImage = '';
  typedText: string = ''; // The text that will be displayed
  wordArray: string[] = []; // Holds the split words
  wordIndex: number = 0; // Current word index
  isBrowser: boolean = false;
  textFinished: boolean = false;

  fullText: string =
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'; // The string to type out

  constructor(@Inject(PLATFORM_ID) platformId: Object,) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(
      () => {
        this.updateLoaded();
      },
      { allowSignalWrites: true }
    );
  }

  updateLoaded() {
    this.loaded.set(this.servicee.loaded());
  }



  ngOnInit(): void {
    this.service.gethomeData().subscribe((res) => {
      this.data.set(res)
      const img = this.translationService.getImgSrc(res.data?.intro[this.translationService.currentLang()]?.main_image)
      this.bgImage = img;

      if (res?.data?.intro[this.translationService.currentLang()]?.tagline) {
        this.fullText =
          res.data.intro[this.translationService.currentLang()].tagline;
        this.wordArray = this.fullText.split(' '); // Split the text into words
        if (this.isBrowser) {
          this.checkLoadedAndType();
        }
      }
    })

  }

  typeLetters() {
    if (this.wordIndex < this.fullText.length) {
      // Append the next letter to the typed text
      this.typedText += this.fullText.charAt(this.wordIndex);
      this.wordIndex++;

      // Call the method again after a delay for the next letter
      setTimeout(() => {
        this.typeLetters();
      }, 100); // Adjust delay for typing speed (100ms between letters)
    }
    if (this.typedText.length === this.fullText.length) {
      this.textFinished = true;
    }
  }

  checkLoadedAndType() {
    const waitForLoaded = setInterval(() => {
      if (this.loaded()) {
        clearInterval(waitForLoaded); // Stop checking
        this.typeLetters(); // Start the typewriter effect
      }
    }, 100); // Check every 100ms
  }

}
