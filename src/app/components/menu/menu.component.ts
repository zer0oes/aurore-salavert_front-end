import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() menuOpened: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleNavbar() {
    if (this.menuOpened) {
      this.menuOpened = false;
    } else {
      this.menuOpened = true;
    }
  }
}
