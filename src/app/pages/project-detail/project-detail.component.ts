import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Project } from '@app/models/frontend/project';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project;
  projectDescriptionHtml: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
  
    if (slug) {
      this.http.get(`http://localhost:1337/api/projects?filters[slug][$eq]=${slug}&populate=*`)
        .subscribe((response: any) => {
          if (response.data.length > 0) {
            const attributes = response.data[0].attributes;
  
            // Extraire les catégories et la galerie correctement
            this.project = {
              ...attributes,
              categories: attributes.categories?.data.map((item: any) => ({
                title: item.attributes.title,
                slug: item.attributes.slug
              })) || [],
              gallery: attributes.gallery?.data.map((item: any) => ({
                id: item.id,
                img: item.attributes.url,
                alt: item.attributes.alternativeText || 'Image'
              })) || []
            };

            this.projectDescriptionHtml = this.convertMarkdownToHtml(attributes.description);
          } else {
            console.error('Projet non trouvé');
          }
        });
    }
  }

  convertMarkdownToHtml(markdown: string): string {
    let html = markdown
      .split(/\n+/)
      .map(line => `<p>${line}</p>`)
      .join('');
    
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\_(.*?)\_/g, '<em>$1</em>')
      .replace(/\<u\>(.*?)\<\/u\>/g, '<u>$1</u>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
    return html;
  }

  toggleImageSize(event: Event): void {
    event.stopPropagation(); // Évite que le clic sur le bouton agrandisse aussi l'image
    const image = (event.target as HTMLElement).parentElement?.querySelector('img');
    if (image) {
      image.classList.toggle('expanded');
    }
  }
}
