import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';
import { MenuItem } from '@app/services/menu-labels';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuOpened = false;
  menuItems: MenuItem[] = [];

  constructor(private router: Router, private menuService: MenuService, private location: Location) {}

  toggleNavbar(): void {
    this.menuOpened = !this.menuOpened;
    this.menuService.toggleMenu(); // Gère l'état du menu dans le service
  }

  navigateToSection(section: string, event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const navigationExtras: NavigationExtras = {
      fragment: section
    };

    // Ferme le menu après la sélection
    this.menuOpened = false;
    this.menuService.setMenuOpened(false); // Si le service gère l'état du menu

    const currentUrl = this.router.parseUrl(this.router.url);
    const segments = currentUrl.root.children['primary']?.segments || [];
    if (segments.length === 0) {
      currentUrl.fragment = section;
      this.location.go(this.router.serializeUrl(currentUrl));
      this.scrollToSection(section);
      return;
    }

    this.router.navigate(['/'], navigationExtras).then(navigated => {
      if (navigated) this.scrollToSection(section);
    });
  }

  private scrollToSection(section: string): void {
    const headerOffset = 80; // Ajuster en fonction de la hauteur du header
    const element = document.getElementById(section);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - document.body.getBoundingClientRect().top + document.body.scrollTop - headerOffset;

      document.body.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  ngOnInit(): void {
    this.menuService.getNavigationItems().subscribe({
      next: (items: MenuItem[]) => {
        this.menuItems = items;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des éléments du menu :', error);
      }
    });
  }
}
