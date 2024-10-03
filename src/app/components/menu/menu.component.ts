import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MenuService } from '@app/services/menu.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  menuOpened = false;

  constructor(private router: Router, private menuService: MenuService) {}

  toggleNavbar() {
    this.menuOpened = !this.menuOpened;
    this.menuService.toggleMenu();
  }

  navigateToSection(section: string) {
    const navigationExtras: NavigationExtras = {
      fragment: section
    };

    // Fermer le menu après la sélection
    this.menuOpened = false;
    this.menuService.setMenuOpened(false); // Optionnel, selon votre logique

    this.router.navigate(['/'], navigationExtras).then(() => {
      // Ajout d'un décalage pour le header
      const headerOffset = 80; // Ajustez selon la hauteur de votre header
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
}
