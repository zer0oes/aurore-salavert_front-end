// project-list.component.ts
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Category, Gallery, PresPortfolio, Project } from '@app/models/frontend/project';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  @Input() showcaseContent: Array<PresPortfolio> = [];
  @Input() projects: Array<Project> = [];

  ngOnInit(): void {
    this.http.get<any>('http://localhost:1337/api/portfolio?populate=*').subscribe((response: any) => {
      const showcaseData = response.data;
      const processedText = this.processText(showcaseData.attributes.Description);

      const portfolio: PresPortfolio = {
        title: showcaseData.attributes.Title,
        description: processedText
      };

      this.showcaseContent.push(portfolio);
    });

    this.http.get<any>('http://localhost:1337/api/projects?populate=*').subscribe((projectData: any) => {
      projectData.data.forEach((element: any) => {
        const cat: Array<Category> = element.attributes.categories.data.map((category: any) => {
          return { title: category.attributes.title, slug: category.attributes.slug };
        });

        const gal: Array<Gallery> = element.attributes.gallery.data.map((item: any) => {
          return { id: item.attributes.id, img: item.attributes.url, alt: item.attributes.alternativeText };
        });

        const newProject: Project = {
          id: element.id,
          slug: element.attributes.slug,
          title: element.attributes.title,
          description: element.attributes.description,
          createdAt: element.attributes.createdAt,
          thumbnail: 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url,
          categories: cat,
          layout: element.attributes.layout.data.attributes.slug,
          gallery: gal
        };

        this.projects.push(newProject);
      });

      this.projects.sort((a: Project, b: Project) => {
        return b.createdAt.localeCompare(a.createdAt);
      });
    });
  }

  processText(text: string): SafeHtml {
    text = text.replace(/\n/g, '</p><p>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    text = text.replace(/_(.*?)_/g, '<i>$1</i>');
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    text = `<p>${text}</p>`;

    // Mark the processed text as safe to display
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
