import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, Gallery, Project } from '@app/models/frontend/project';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  @Input() title: string = 'creative showcase';
  @Input() description: string = 'Discover my ideas and my graphic touch by watching the projects below';
  projects: Array<Project> = [];
  originalProjects: Array<Project> = [];
  usedCategories: string[] = [];
  activeCategory: string = 'All'; // Catégorie active par défaut

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:1337/api/projects?populate=*').subscribe((project: any) => {
      project.data.forEach((element: any) => {
        if (element.attributes) {
          let cat: Array<Category> = [];
          if (element.attributes.categories?.data) {
            element.attributes.categories.data.forEach((category: any) => {
              cat.push({
                title: category.attributes.title,
                slug: category.attributes.slug
              });
              if (!this.usedCategories.includes(category.attributes.slug)) {
                this.usedCategories.push(category.attributes.slug);
              }
            });
          }

          let gal: Array<Gallery> = [];
          if (element.attributes.gallery?.data) {
            element.attributes.gallery.data.forEach((item: any) => {
              gal.push({
                id: item.id,
                img: 'http://localhost:1337' + item.attributes.url,
                alt: item.attributes.alternativeText || 'Image'
              });
            });
          }

          let newProject: Project = {
            id: element.id,
            slug: element.attributes.slug,
            title: element.attributes.title,
            description: element.attributes.description,
            createdAt: element.attributes.createdAt,
            thumbnail: element.attributes.thumbnail?.data ? 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url : '',
            categories: cat,
            layout: element.attributes.layout?.data ? element.attributes.layout.data.attributes.slug : '',
            gallery: gal
          }

          this.originalProjects.push(newProject);
        }
      });

      this.originalProjects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));
      this.projects = [...this.originalProjects];
    });
  }

  getProjectClasses(project: Project): string[] {
    const layoutClass = typeof project.layout === 'string' ? project.layout : '';
    const categoryClasses = project.categories.map(cat => cat.slug);
    return [layoutClass, ...categoryClasses].filter(cls => cls);
  }

  filterProjectsByCategory(category: string): void {
    this.activeCategory = category; // Met à jour la catégorie active
    if (category === 'All') {
      this.projects = [...this.originalProjects];
    } else {
      this.projects = this.originalProjects.filter(project =>
        project.categories.some(cat => cat.slug === category)
      );
    }
    this.projects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));
  }
}
