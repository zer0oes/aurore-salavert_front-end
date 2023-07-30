import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
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
    const thresholdScrollPosition = 0.7 * viewportHeight;
    this.headerAltClassAdded = scrollPosition >= thresholdScrollPosition;
  }

}
