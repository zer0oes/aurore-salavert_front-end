<<<<<<< HEAD
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
=======
import { Component, ElementRef, HostListener, Renderer2, ViewChild, OnInit } from '@angular/core';
import { MenuService } from '@app/services/menu.service';
>>>>>>> master

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
<<<<<<< HEAD
  headerAltClassAdded: boolean = false;

  constructor(private router: Router, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        const isProjectDetailPage = currentUrl.includes('/project');
        const isHomePage = currentUrl === '/';

        if (isProjectDetailPage) {
          document.querySelector('header').classList.add('header-alt');
        } else {
          document.querySelector('header').classList.remove('header-alt');
        }

        if (isHomePage) {
          this.enableScrollListener();
          console.log("headerAltClassAdded: ", this.headerAltClassAdded);
        } else {
          this.disableScrollListener();
          this.headerAltClassAdded = false;
        }
      }
    });
  }

  private enableScrollListener() {
    window.addEventListener('scroll', this.onWindowScroll, true);
  }

  private disableScrollListener() {
    window.removeEventListener('scroll', this.onWindowScroll, true);
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const thresholdScrollPosition = 0.6 * viewportHeight;
    this.headerAltClassAdded = scrollPosition >= thresholdScrollPosition;
=======
  constructor(private renderer: Renderer2, private menuService: MenuService) {}
  
  @ViewChild('headerElement') headerElement!: ElementRef;
  @ViewChild('menuElement') menuElement!: ElementRef;
  menuOpened = false;
  scrolled = false;
  
  ngOnInit(): void {
    this.menuService.menuOpened$.subscribe(opened => {
      this.menuOpened = opened;
    });
>>>>>>> master
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
