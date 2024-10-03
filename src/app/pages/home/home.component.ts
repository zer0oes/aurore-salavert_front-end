import { Component, OnInit } from '@angular/core';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menuItems: any[] = [];
  title: string = 'Aurore Salavert - Graphic & Web designer, front-end developer - Paris - France';

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe((items: any[]) => {
      this.menuItems = items;
    });

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
    }
  }
}
