import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  constructor() { }

  title: string = 'Aurore Salavert - Graphic & Web designer, front-end developer - Paris - France';

  ngOnInit(): void { }
}

