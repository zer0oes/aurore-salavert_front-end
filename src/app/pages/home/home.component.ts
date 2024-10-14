import { Component, OnInit } from '@angular/core';
import { MenuService } from '@app/services/menu.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menuItems: any[] = [];
  title: string = 'Aurore Salavert - Enthousiastic Graphic & Web developer - Paris, France';

  constructor(private menuService: MenuService, private metaService: Meta, private titleService: Title) {}

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

    // SEO Optimization
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'description', content: 'Discover the unique creations of Aurore Salavert, graphic and web designer in Paris. Front-end development services, UX/UI design, and personalized branding.' },
      { name: 'keywords', content: 'Graphic designer, Web designer, Front-end developer, Paris, Branding, UX/UI design' },
      { property: 'og:title', content: this.title },
      { property: 'og:description', content: 'Discover the unique creations of Aurore Salavert, graphic and web designer in Paris.' },
      { property: 'og:image', content: 'https://auroresalavert.s3.eu-west-3.amazonaws.com/portfolio_home_f685777581.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX5ZI55I2UKBPAHJO%2F20241014%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20241014T110905Z&X-Amz-Expires=900&X-Amz-Signature=4a23c726a88000f75898485353a163d5f7293d785f196adb299cf07d810a892a&X-Amz-SignedHeaders=host&x-id=GetObject' },
      { property: 'og:url', content: 'https://aurore-salavert.fr' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: this.title },
      { name: 'twitter:description', content: 'Discover the unique creations of Aurore Salavert, graphic and web designer in Paris.' },
      { name: 'twitter:image', content: 'https://auroresalavert.s3.eu-west-3.amazonaws.com/portfolio_home_f685777581.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX5ZI55I2UKBPAHJO%2F20241014%2Feu-west-3%2Fs3%2Faws4_request&X-Amz-Date=20241014T110905Z&X-Amz-Expires=900&X-Amz-Signature=4a23c726a88000f75898485353a163d5f7293d785f196adb299cf07d810a892a&X-Amz-SignedHeaders=host&x-id=GetObject' }
    ]);
  }
}