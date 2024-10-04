import { Component, ElementRef, HostListener, Renderer2, ViewChild, OnInit } from '@angular/core';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private renderer: Renderer2, private menuService: MenuService) {}
  
  @ViewChild('headerElement') headerElement!: ElementRef;
  @ViewChild('menuElement') menuElement!: ElementRef;
  menuOpened = false;
  scrolled = false;
  
  ngOnInit(): void {
    this.menuService.menuOpened$.subscribe(opened => {
      this.menuOpened = opened;
    });
  }
  
  @HostListener('window:scroll', ['$event'])
onWindowScroll(event: Event) {
    const scrollPosition = window.scrollY;
    const triggerHeight = window.innerHeight * 0.75;

    this.scrolled = scrollPosition > triggerHeight;

    if (this.scrolled) {
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
