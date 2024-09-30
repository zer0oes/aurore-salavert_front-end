import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('headerElement') headerElement!: ElementRef;

  constructor(private renderer: Renderer2) { }
  
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    const triggerHeight = window.innerHeight * 0.75;

    if (scrollPosition > triggerHeight) {
      this.renderer.addClass(this.headerElement.nativeElement, 'scrolled');
    } else {
      this.renderer.removeClass(this.headerElement.nativeElement, 'scrolled');
    }
  }
}