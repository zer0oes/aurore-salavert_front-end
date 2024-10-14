import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Project } from '@app/models/frontend/project';
import { environment } from '@src/environment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  projectDescriptionHtml: string = '';
  projects: Project[] = [];
  currentIndex: number | null = null;
  isHeaderAlt: boolean = false; 
  previousProject: Project | null = null;
  nextProject: Project | null = null;
  isImageExpanded: boolean = false;
  expandedImageSrc: string | null = null;
  isLensVisible: boolean = false;
  titlePrev: string | '';
  titleNext: string | '';
  zoomedIn: boolean = false;
  public url = environment.url;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta
  ) { 
    this.fetchProjects();
  }

  ngOnInit(): void {
    const header = document.querySelector('header');
    if (header) {
      this.renderer.addClass(header, 'header-alt');
    }
  
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.fetchProjects().then(() => {
          this.fetchProjectData(slug);
        });
      } else {
        console.error('Slug non fourni');
      }
    });
    this.renderer.listen('window', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.handleEscape();
      }
    });

    window.addEventListener('popstate', this.handleBackButton.bind(this));
  }

  handleEscape(): void {
    if (this.zoomedIn) {
      const zoomedImage = document.querySelector('.expanded-image.zoomed') as HTMLImageElement;
  
      if (zoomedImage) {
        zoomedImage.classList.remove('zoomed');
      }
  
      this.zoomedIn = false;
    } else if (this.isImageExpanded) {
      this.closeImage();
    }
  }

  handleBackButton(): void {
    if (this.zoomedIn) {
      this.zoomedIn = false;
      history.pushState(null, '', window.location.href);
    } else if (this.isImageExpanded) {
      this.closeImage();
      history.pushState(null, '', window.location.href);
    }
  }

  ngOnDestroy(): void {
    const header = document.querySelector('header');
    if (header) {
      this.renderer.removeClass(header, 'header-alt');
    }

    window.removeEventListener('popstate', this.handleBackButton.bind(this));
  }

  private fetchProjects(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/api/projects?populate=*`)
        .subscribe((response: any) => {
          if (response.data) {
            this.projects = response.data.map((item: any) => ({
              id: item.id,
              slug: item.slug || 'no-slug',
              title: item.title || 'No Title',
              description: item.description || 'No Description',
              createdAt: new Date(item.createdAt),
              ...item
            })).sort((a: Project, b: Project) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
            resolve();
          } else {
            console.error('Aucun projet trouvé');
            reject('Aucun projet trouvé');
          }
        }, error => {
          console.error('Erreur lors de la récupération des projets:', error);
          reject(error);
        });
    });
  }

  private fetchProjectData(slug: string): void {
    this.http.get(`${this.url}/api/projects?filters[slug][$eq]=${slug}&populate=*`)
      .subscribe((response: any) => {
        if (response.data && response.data.length > 0) {
          const projectData = response.data[0];
  
          this.project = {
            id: projectData.id,
            slug: projectData.slug || 'no-slug',
            title: projectData.title || 'No Title',
            description: projectData.description || 'No Description',
            
            categories: projectData.categories?.map((category: any) => ({
              title: category.title || 'No Title',
              slug: category.slug || 'no-slug'
            })) || [],
  
            gallery: projectData.gallery?.map((item: any) => ({
              id: item.id,
              img: item.url.startsWith('http') ? item.url : this.url + (item.url || ''),
              alt: item.alternativeText || 'Image'
            })) || [],
  
            thumbnail: projectData.thumbnail ? this.url + projectData.thumbnail.url : '',
            createdAt: projectData.createdAt || '',
            layout: projectData.layout ? projectData.layout.slug : ''
          };
  
          this.projectDescriptionHtml = this.convertMarkdownToHtml(projectData.description);
  
          this.updateCurrentIndex();
          this.isHeaderAlt = this.currentIndex !== null && this.currentIndex > 0;
          this.previousProject = this.currentIndex > 0 ? this.projects[this.currentIndex - 1] : null;
          this.nextProject = this.currentIndex < this.projects.length - 1 ? this.projects[this.currentIndex + 1] : null;
          this.titlePrev = this.previousProject ? this.previousProject.title : '';
          this.titleNext = this.nextProject ? this.nextProject.title : '';

          this.titleService.setTitle(`${this.project.title} - Aurore Salavert - Enthusiastic Graphic & Web developer - Paris, France`);
          const plainDescription = this.project.description.replace(/\*\*|\_|\<u\>|\<\/u\>/g, '');
          this.metaService.updateTag({ name: 'description', content: plainDescription });
        } else {
          console.error('Projet non trouvé');
        }
      }, error => {
        console.error('Erreur lors de la récupération du projet:', error);
      });
  }

  private convertMarkdownToHtml(markdown: string): string {
    if (!markdown) return '';

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

  zoomImage(event: MouseEvent): void {
    const img = event.target as HTMLImageElement;
  
    if (this.zoomedIn) {
      img.classList.remove('zoomed');
      this.zoomedIn = false;
    } else {
      this.zoomedIn = true;
    }
  }

  moveLens(event: MouseEvent): void {
    if (!this.zoomedIn) {
      return;
    }
  
    const img = event.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    img.classList.add('zoomed');
  }

  toggleImageSize(event: Event, item: any): void {
    event.stopPropagation();
    this.expandedImageSrc = item.img;
    this.isImageExpanded = !this.isImageExpanded;
  }

  closeImage(): void {
    this.isImageExpanded = false;
    this.zoomedIn = false;
  }

  updateCurrentIndex(): void {
    const slug = this.route.snapshot.paramMap.get('slug');  
    this.currentIndex = this.projects.findIndex(project => project.slug === slug);
    if (this.currentIndex === -1) {
      console.error('Index du projet actuel non trouvé pour le slug:', slug);
    }
  }

  navigateToPreviousProject(): void {
    if (this.currentIndex !== null && this.currentIndex > 0) {
      const previousProject = this.projects[this.currentIndex - 1];
      if (previousProject && previousProject.slug) {
        this.router.navigate(['/project', previousProject.slug]);
      } else {
        console.error('Projet précédent non défini ou slug manquant');
      }
    }
  }
  
  navigateToNextProject(): void {
    if (this.currentIndex !== null && this.currentIndex < this.projects.length - 1) {
      const nextProject = this.projects[this.currentIndex + 1];
      if (nextProject && nextProject.slug) {
        this.router.navigate(['/project', nextProject.slug]);
      } else {
        console.error('Projet suivant non défini ou slug manquant');
      }
    }
  }

  getCursorPos(event: MouseEvent, img: HTMLImageElement): { x: number, y: number } {
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
  }
}