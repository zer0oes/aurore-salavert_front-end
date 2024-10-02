import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('headerElement') headerElement!: ElementRef;
  @ViewChild('menuElement') menuElement!: ElementRef;

  constructor(private renderer: Renderer2) { }
  
  scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY;
    const triggerHeight = window.innerHeight * 0.75;

    if (scrollPosition > triggerHeight) {
      this.renderer.addClass(this.headerElement.nativeElement, 'scrolled');
    } else {
      this.renderer.removeClass(this.headerElement.nativeElement, 'scrolled');
    }
  }

  toggleMenu() {
    if (this.menuElement.nativeElement.classList.contains('is-open')) {
      this.renderer.addClass(this.headerElement.nativeElement, 'menu-opened');
    } else {
      this.renderer.removeClass(this.headerElement.nativeElement, 'menu-opened');
    }
  }
}
