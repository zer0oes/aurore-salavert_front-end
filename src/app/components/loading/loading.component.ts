import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const loader = document.querySelector('.loading') as HTMLElement;

    const minimumDelay = 3000; 
    const animationDuration = 300;
    const totalDelay = minimumDelay + animationDuration;

    setTimeout(() => {
      loader.classList.add('ng-leave');

      setTimeout(() => {
        loader.style.display = 'none';
      }, animationDuration);
    }, minimumDelay);
  }
}
