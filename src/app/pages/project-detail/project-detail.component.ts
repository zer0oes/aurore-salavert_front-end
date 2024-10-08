import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Project } from '@app/models/frontend/project';
import { environment } from '@src/environment';


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
  public url = environment.url;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
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
        // Appeler fetchProjects() puis fetchProjectData() une fois les projets chargés
        this.fetchProjects().then(() => {
          this.fetchProjectData(slug);
        });
      } else {
        console.error('Slug non fourni');
      }
    });
  }

  ngOnDestroy(): void {
    const header = document.querySelector('header');
    if (header) {
      this.renderer.removeClass(header, 'header-alt');
    }
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
              createdAt: item.createdAt || '',
              ...item
            }));
  
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
            
            // Gestion des catégories
            categories: projectData.categories?.map((category: any) => ({
              title: category.title || 'No Title',
              slug: category.slug || 'no-slug'
            })) || [],
  
            // Gestion de la galerie
            gallery: projectData.gallery?.map((item: any) => ({
              id: item.id,
              img: this.url + (item.url || ''),
              alt: item.alternativeText || 'Image'
            })) || [],
  
            // Gestion du thumbnail
            thumbnail: projectData.thumbnail ? this.url + projectData.thumbnail.url : '',
  
            // Ajout de createdAt et layout avec valeurs par défaut
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

  toggleImageSize(event: Event, item: any): void {
    event.stopPropagation();
    this.expandedImageSrc = item.img;
    this.isImageExpanded = !this.isImageExpanded;
  }

  closeImage(): void {
    this.isImageExpanded = false;
    setTimeout(() => {
      this.expandedImageSrc = null;
    }, 400);
  }

  updateCurrentIndex(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log('Recherche du projet avec le slug:', slug);
    console.log('Projets disponibles:', this.projects);
  
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

  moveLens(event: MouseEvent): void {
    const img = event.target as HTMLImageElement;
    const lens = document.querySelector('.zoom-lens') as HTMLElement;

    if (!lens) {
      return;
    }

    this.isLensVisible = true;

    const pos = this.getCursorPos(event, img);
    const zoom = 2;
    let x = pos.x - lens.offsetWidth / 2 + 300;
    let y = pos.y - lens.offsetHeight / 2;

    if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
    if (x < 0) { x = 0; }
    if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
    if (y < 0) { y = 0; }

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;

    lens.style.backgroundImage = `url('${img.src}')`;
    lens.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
    lens.style.backgroundPosition = `-${(pos.x * zoom) - (lens.offsetWidth / 2)}px -${(pos.y * zoom) - (lens.offsetHeight / 2)}px`;

    lens.style.opacity = '1';
  }
  
  hideLens(): void {
    const lens = document.getElementById('lens') as HTMLElement;
  
    if (lens) {
      lens.style.opacity = '0';
    }
  
    this.isLensVisible = false;
  }

  getCursorPos(event: MouseEvent, img: HTMLImageElement): { x: number, y: number } {
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x: x, y: y };
  }
}