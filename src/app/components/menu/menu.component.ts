import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';

interface MenuItem {
  title: string;
  slug: string;
}

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuOpened = false;
  menuItems: MenuItem[] = [];

  constructor(private router: Router, private menuService: MenuService) {}

  toggleNavbar(): void {
    this.menuOpened = !this.menuOpened;
    this.menuService.toggleMenu(); // Gère l'état du menu dans le service
  }

  navigateToSection(section: string): void {
    const navigationExtras: NavigationExtras = {
      fragment: section
    };

    // Ferme le menu après la sélection
    this.menuOpened = false;
    this.menuService.setMenuOpened(false); // Si le service gère l'état du menu

    this.router.navigate(['/'], navigationExtras).then(() => {
      const headerOffset = 80; // Ajuster en fonction de la hauteur du header
      const element = document.getElementById(section);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe({
      next: (items: MenuItem[]) => {
        this.menuItems = items;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des éléments du menu :', error);
      }
    });
  }
}
