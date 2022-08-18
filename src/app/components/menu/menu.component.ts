import { HostBinding } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @HostBinding('class.main-nav__is-open') menuOpened = false;

  constructor() { }

  ngOnInit(): void {
  }
  toggleNavbar() {
    this.menuOpened = !this.menuOpened;
  }
}
