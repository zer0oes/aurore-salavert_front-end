import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;

        const isProjectDetailPage = currentUrl.includes('/project');

        if (isProjectDetailPage) {
          document.querySelector('header').classList.add('header-alt');
        } else {
          document.querySelector('header').classList.remove('header-alt');
        }
      }
    })
  }

}
