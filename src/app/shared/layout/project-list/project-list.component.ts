import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, CreativeShowcase, Gallery, Project } from '@app/models/frontend/project';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() showcaseInfos: Array<CreativeShowcase> = [];
  @Input() projects: Array<Project> = [];
  @Input() originalProjects: Array<Project> = [];
  usedCategories: string[] = [];
  activeCategory: string = 'All';
  fadeOut: boolean = false;
  private url = environment.url;

  ngOnInit(): void {
    this.http.get(`${this.url}api/showcase?populate=*`).subscribe((response: any) => {
      const showcaseData = response.data;

      const showcase: CreativeShowcase = {
        title: showcaseData.attributes.Title,
        descritpion: showcaseData.attributes.Description,
        slug: showcaseData.attributes.slug
      };

      this.showcaseInfos.push(showcase);
    });

    this.http.get(`${this.url}api/projects?populate=*`).subscribe((project: any) => {
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
                img: this.url + item.attributes.url,
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
            thumbnail: element.attributes.thumbnail?.data ? this.url + element.attributes.thumbnail.data.attributes.url : '',
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

  getProjectClasses(project: Project): string {
    const layoutClass = typeof project.layout === 'string' ? project.layout : '';
    const categoryClasses = project.categories.map(cat => cat.slug).join(' ');
    return [layoutClass, categoryClasses].filter(cls => cls).join(' ');
  }
  

  filterProjectsByCategory(category: string): void {
    this.fadeOut = true;
    setTimeout(() => {
      this.activeCategory = category;
      if (category === 'All') {
        this.projects = [...this.originalProjects];
      } else {
        this.projects = this.originalProjects.filter(project =>
          project.categories.some(cat => cat.slug === category)
        );
      }
      this.projects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));
      this.fadeOut = false;
    }, 400);
  }

  getAnimationClass(project: Project): string {
    return this.fadeOut ? 'fade-out' : 'fade-in';
  }
}
