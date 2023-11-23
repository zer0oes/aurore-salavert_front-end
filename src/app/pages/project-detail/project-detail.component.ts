// project-detail.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/models/frontend/project';
import { ProjectService } from '@app/services/project.service';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  @Input() project: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const urlSlug = params['slug']; // Slug from the URL
      this.projectService.getProjects().subscribe(
        (response: any) => {
          const projects = response.data;
  
          // Find the project with the matching slug
          const matchingProject = projects.find((project: any) => project.attributes.slug === urlSlug);
  
          if (matchingProject) {
            this.project = {
              id: matchingProject.id,
              slug: matchingProject.attributes.slug,
              title: matchingProject.attributes.title,
              description: this.convertMarkdownToHTML(matchingProject.attributes.description),
              createdAt: matchingProject.attributes.createdAt,
              thumbnail: 'http://localhost:1337' + matchingProject.attributes.thumbnail.data.attributes.url,
              categories: matchingProject.attributes.categories.data.map((category: any) => ({
                title: category.attributes.title,
                slug: category.attributes.slug,
              })),
              layout: matchingProject.attributes.layout.data.attributes.slug,
              gallery: matchingProject.attributes.gallery.data.map((item: any) => ({
                id: item.attributes.id,
                img: 'http://localhost:1337' + item.attributes.url,
                alt: item.attributes.alternativeText,
              })),
            };
          } else {
            console.error('Project not found for slug:', urlSlug);
            // Gérer le cas où aucun projet n'est trouvé pour le slug
          }
        },
        (error: any) => {
          console.error('Error retrieving projects:', error);
          // Gérer l'erreur selon vos besoins
        }
      );
    });
  }
  
  convertMarkdownToHTML(markdownText: string): string {
    // Décoder les entités HTML
    const decodedText = this.decodeHTMLEntities(markdownText);
  
    // Remplace **text** par <b>text</b>
    const boldText = decodedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Remplace _text_ par <i>text</i>
    const italicText = boldText.replace(/_(.*?)_/g, '<i>$1</i>');
  
    // Divise le texte en lignes
    const lines = italicText.split('\n');
  
    // Enveloppe chaque ligne dans une balise <p>
    const paragraphText = lines.map(line => `<p>${line}</p>`).join('');
  
    return paragraphText;
  }
  
  decodeHTMLEntities(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.body.textContent || "";
  }
  
}
