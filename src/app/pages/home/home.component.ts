import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor() { }

  title: string = 'Aurore Salavert - Graphic & Web designer, front-end developer - Paris - France';

  ngOnInit(): void {
    // Vérifie si l'URL contient un hash
    const hash = window.location.hash;
    if (hash) {
      // Scrolle jusqu'à la section correspondante après un court délai
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600); // Le délai permet d'assurer que la page est complètement chargée
    }
  }
}

