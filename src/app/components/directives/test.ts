import { Directive, ElementRef, Renderer2, HostListener, Input, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    standalone: true,
    selector: '[appTrackSectionScroll]'
})
export class TrackSectionScrollDirective implements OnInit {
    @Input() scrollThresholdTop: number = 0; // Distance from top to trigger
    @Input() scrollThresholdBottom: number = 0; // Distance from bottom to trigger
    @Input() activeClass: string = 'active'; // Class to add or remove
    private scrollListener: (() => void) | undefined;

    private isBrowser: boolean;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.checkSectionScroll();
            // Attach scroll listener
            this.scrollListener = this.renderer.listen('window', 'scroll', () => this.checkSectionScroll());
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (this.isBrowser) {
            this.checkSectionScroll();
        }
    }

    ngOnDestroy() {
        // Clean up the scroll listener
        if (this.scrollListener) {
            this.scrollListener();
        }
    }

    private checkSectionScroll() {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const distanceFromTop = rect.top;
        const distanceFromBottom = window.innerHeight - rect.bottom;

        if (distanceFromTop <= this.scrollThresholdTop && distanceFromBottom <= this.scrollThresholdBottom) {
            this.addClassToChildren();
        } else {
            this.removeClassFromChildren();
        }
    }

    private addClassToChildren() {
        const children = this.el.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            this.renderer.addClass(children[i], this.activeClass);
        }
    }

    private removeClassFromChildren() {
        const children = this.el.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            this.renderer.removeClass(children[i], this.activeClass);
        }
    }
}
