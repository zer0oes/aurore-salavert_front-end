import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, CreativeShowcase, Gallery, Project } from '@app/models/frontend/project';
import { LocaleService } from '@app/services/locale.service';
import { environment } from '@src/environment';


@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient, private localeService: LocaleService) { }

  @Input() showcaseInfos: Array<CreativeShowcase> = [];
  @Input() projects: Array<Project> = [];
  @Input() originalProjects: Array<Project> = [];
  usedCategories: string[] = [];
  activeCategory: string = 'All';
  fadeOut: boolean = false;
  private url = environment.url;

  ngOnInit(): void {
    const locale = this.localeService.getLocale();
    this.http.get(`${this.url}/api/showcase?populate=*&locale=${locale}`).subscribe((response: any) => {
      const showcaseData = response.data;

      const showcase: CreativeShowcase = {
        title: showcaseData.Title,
        descritpion: showcaseData.Description,
        slug: showcaseData.slug
      };

      this.showcaseInfos.push(showcase);
    });

    this.http.get(`${this.url}/api/projects?populate=*&locale=${locale}`).subscribe((response: any) => {
      const projectData = response?.data;
    
      if (Array.isArray(projectData)) {
        projectData.forEach((element: any) => {
          if (element) {
            const attributes = element;
    
            // Récupération des catégories
            let cat: Array<Category> = [];
            if (attributes.categories && Array.isArray(attributes.categories)) {
              attributes.categories.forEach((category: any) => {
                cat.push({
                  title: category.title || 'No Title',
                  slug: category.slug || 'no-slug'
                });
                if (!this.usedCategories.includes(category.slug)) {
                  this.usedCategories.push(category.slug);
                }
              });
            }
    
            // Récupération de la galerie
            let gal: Array<Gallery> = [];
            if (attributes.gallery && Array.isArray(attributes.gallery)) {
              attributes.gallery.forEach((item: any) => {
                gal.push({
                  id: item.id,
                  img: item.url.startsWith('http') ? item.url : this.url + (item.url || ''),
                  alt: item.alternativeText || 'Image'
                });
              });
            }
    
            // Création du nouvel objet projet
            const newProject: Project = {
              id: attributes.id,
              slug: attributes.slug || 'no-slug',
              title: attributes.title || 'No Title',
              description: attributes.description || 'No Description',
              createdAt: attributes.createdAt || '',
              thumbnail: attributes.thumbnail.url.startsWith('http') ? attributes.thumbnail.url : this.url + (attributes.thumbnail.url || ''),
              categories: cat,
              layout: attributes.layout ? attributes.layout.slug : '',
              gallery: gal
            };
    
            this.originalProjects.push(newProject);
          }
        });
    
        this.originalProjects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));
        this.projects = [...this.originalProjects];
      } else {
        console.error('Les données de projet ne sont pas au format attendu.');
      }
    }, (error) => {
      console.error('Erreur lors du chargement des projets:', error);
    });
  };

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
