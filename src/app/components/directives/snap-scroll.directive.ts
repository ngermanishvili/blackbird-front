import { Directive, ElementRef, Input, Renderer2, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appScrollSnap]',
    standalone: true
})
export class ScrollSnapDirective implements OnChanges {
    @Input() appScrollSnap: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appScrollSnap']) {
            if (this.appScrollSnap) {
                this.enableScrollSnap();
            } else {
                this.disableScrollSnap();
            }
        }
    }

    private enableScrollSnap() {
        this.renderer.setStyle(this.el.nativeElement, 'scroll-snap-type', 'y mandatory');
        this.renderer.setStyle(this.el.nativeElement, 'scroll-snap-align', 'start');
    }

    private disableScrollSnap() {
        this.renderer.removeStyle(this.el.nativeElement, 'scroll-snap-type');
        this.renderer.removeStyle(this.el.nativeElement, 'scroll-snap-align');
    }
}
