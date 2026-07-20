import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Category, CreativeShowcase, Gallery, Project } from '@app/models/frontend/project';
import { LocaleService } from '@app/services/locale.service';
import { environment } from '@src/environment';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterViewInit {
  @ViewChildren('projectElement', { read: ElementRef }) projectElements!: QueryList<ElementRef>;

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

      if (!showcaseData) {
        return;
      }

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

  ngAfterViewInit(): void {
    this.projectElements.changes.subscribe((queryList) => {
      if (queryList.length > 0) {
        console.log("Project elements found:", queryList.length);
        this.initIntersectionObserver();
      } else {
        console.warn("Waiting for project elements to be rendered...");
      }
    });

    setTimeout(() => {
      if (this.projectElements.length > 0) {
        this.initIntersectionObserver();
      } else {
        console.warn("Elements not ready, retrying...");
      }
    }, 1000);
  }

  initIntersectionObserver(): void {
    console.log("Project Elements:", this.projectElements.length);
    if (this.projectElements.length === 0) {
      console.warn("No project elements found to observe.");
      return;
    }

    const observerOptions = {
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        console.log("Observed entry:", entry.target); // Verify observed elements
        if (entry.isIntersecting) {
          console.log("Element is intersecting:", entry.target); // Log intersecting elements
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.projectElements.forEach((projectElement) => {
      observer.observe(projectElement.nativeElement);
    });

    // Keep every project accessible if IntersectionObserver does not fire
    // (for example after an async render, a resize, or a restored scroll position).
    setTimeout(() => {
      this.projectElements.forEach((projectElement) => {
        projectElement.nativeElement.classList.add('fade-in');
        observer.unobserve(projectElement.nativeElement);
      });
    }, 1000);
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

      setTimeout(() => {
        this.initIntersectionObserver();
      }, 100);
    }, 400);
  }
}
