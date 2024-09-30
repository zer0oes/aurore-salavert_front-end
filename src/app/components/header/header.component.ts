import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) { }
  
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    const triggerHeight = window.innerHeight * 0.75;

    if (scrollPosition > triggerHeight) {
      this.renderer.addClass(this.el.nativeElement, 'scrolled');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'scrolled');
    }
  }
}