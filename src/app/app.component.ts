import { installOverlayScrollbars } from './overlay-scrollbars';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;

  private scrollbarCleanup?: () => void;

  ngAfterViewInit(): void {
    this.scrollbarCleanup = installOverlayScrollbars();
  }

  ngOnDestroy(): void {
    this.scrollbarCleanup?.();
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    });
  }
}
