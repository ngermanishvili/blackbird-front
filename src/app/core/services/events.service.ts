import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { throttleTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WindowService implements OnDestroy {
  private resizeSubject = new BehaviorSubject<{
    width: number;
    height: number;
  } | null>(null);
  private scrollSubject = new BehaviorSubject<number>(0);

  resize$: Observable<{ width: number; height: number } | null> =
    this.resizeSubject.asObservable();
  scroll$: Observable<number> = this.scrollSubject.asObservable();

  private lastScrollTop = 0;

  constructor(
    private ngZone: NgZone,

    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.init();
  }

  private init() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof window !== 'undefined') {
        this.ngZone.runOutsideAngular(() => {
          fromEvent(window, 'resize')
            .pipe(
              throttleTime(200),
              map(() => ({
                width: window.innerWidth,
                height: window.innerHeight,
              }))
            )
            .subscribe((resolution) =>
              this.ngZone.run(() => this.resizeSubject.next(resolution))
            );

          fromEvent(window, 'scroll')
            .pipe(
              throttleTime(200),
              map(
                () => window.pageYOffset || document.documentElement.scrollTop
              )
            )
            .subscribe((scrollTop) =>
              this.ngZone.run(() => this.scrollSubject.next(scrollTop))
            );
        });
      }
    }
  }

  ngOnDestroy() {
    this.resizeSubject.complete();
    this.scrollSubject.complete();
  }
}
