import { Component, OnInit, OnDestroy, Renderer2, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Gallery, Project } from '@app/models/frontend/project';
import { environment } from '@src/environment';
import { Meta, Title } from '@angular/platform-browser';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('galleryImage') galleryImages!: QueryList<ElementRef>;
  @ViewChildren('projectVideo') projectVideos!: QueryList<ElementRef<HTMLVideoElement>>;

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
  videoPlayingState: Record<number, boolean> = {};
  videoMutedState: Record<number, boolean> = {};
  videoUserPausedState: Record<number, boolean> = {};
  videoFullscreenState: Record<number, boolean> = {};
  public url = environment.url;
  private videoObserver?: IntersectionObserver;
  private removeFullscreenListener?: () => void;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private localeService: LocaleService
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

    this.removeFullscreenListener = this.renderer.listen('document', 'fullscreenchange', () => {
      this.syncFullscreenState();
    });

    window.addEventListener('popstate', this.handleBackButton.bind(this));
  }

  ngAfterViewInit(): void {
    // Observer les changements sur galleryImages pour être sûr que les éléments sont prêts
    this.galleryImages.changes.subscribe(() => {
      if (this.galleryImages.length > 0) {
        console.log(`Found ${this.galleryImages.length} gallery images. Initializing observer...`);
        this.initGalleryObserver();
      } else {
        console.error('No gallery images found to observe.');
      }
    });

    this.projectVideos.changes.subscribe(() => {
      this.initVideoObserver();
    });

    this.initVideoObserver();
  }

  private initGalleryObserver(): void {
    const observerOptions = {
      rootMargin: '0px 0px 200px 0px', // Déclenche l'effet légèrement avant l'entrée dans le viewport
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('fade-in');
          }, index * 400); // Intervalle de 400 ms entre chaque image

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.galleryImages.forEach((image) => {
      observer.observe(image.nativeElement);
    });
  }

  private initVideoObserver(): void {
    this.videoObserver?.disconnect();

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const mediaId = Number(video.dataset['mediaId']);

        if (!Number.isFinite(mediaId)) {
          return;
        }

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!this.videoUserPausedState[mediaId]) {
            video.muted = this.videoMutedState[mediaId] ?? true;
            this.startVideo(video);
          }
          return;
        }

        if (!video.paused) {
          video.pause();
        }
      });
    }, {
      threshold: [0, 0.5, 1]
    });

    this.projectVideos.forEach((videoElement) => {
      this.videoObserver?.observe(videoElement.nativeElement);
    });
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

    this.videoObserver?.disconnect();
    this.removeFullscreenListener?.();
    window.removeEventListener('popstate', this.handleBackButton.bind(this));
  }

  private fetchProjects(): Promise<void> {
    const locale = this.localeService.getLocale();
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/api/projects?populate=*&locale=${locale}`)
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
    const locale = this.localeService.getLocale();
    this.http.get(`${this.url}/api/projects?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`)
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
  
            gallery: projectData.gallery?.reduce((gallery: Gallery[], item: any) => {
              const mediaType = this.getMediaType(item);

              if (!mediaType || !item.url) {
                return gallery;
              }

              gallery.push({
                id: item.id,
                img: this.getMediaUrl(item.url),
                alt: item.alternativeText || item.caption || item.name || (mediaType === 'video' ? 'Vidéo du projet' : 'Image du projet'),
                mediaType,
                mime: item.mime || ''
              });

              return gallery;
            }, []) || [],
  
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

  private getMediaType(item: any): Gallery['mediaType'] | null {
    const mime = (item.mime || '').toLowerCase();

    if (mime.startsWith('image/')) {
      return 'image';
    }

    if (mime.startsWith('video/')) {
      return 'video';
    }

    if (mime) {
      return null;
    }

    const extension = (item.ext || item.url?.split('?')[0].match(/\.[^.\/]+$/)?.[0] || '').toLowerCase();
    const videoExtensions = ['.mp4', '.webm', '.ogv', '.ogg', '.mov', '.m4v'];
    const imageExtensions = ['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'];

    if (videoExtensions.includes(extension)) {
      return 'video';
    }

    if (imageExtensions.includes(extension)) {
      return 'image';
    }

    return null;
  }

  private getMediaUrl(url: string): string {
    return url.startsWith('http') ? url : this.url + url;
  }

  private startVideo(video: HTMLVideoElement): void {
    video.play().catch((error) => {
      console.error('Impossible de lancer la vidéo :', error);
    });
  }

  playVideo(event: Event, video: HTMLVideoElement, mediaId: number): void {
    event.stopPropagation();
    this.videoUserPausedState = {
      ...this.videoUserPausedState,
      [mediaId]: false
    };
    this.startVideo(video);
  }

  toggleVideoPlayback(event: Event, video: HTMLVideoElement, mediaId: number): void {
    event.stopPropagation();

    if (video.paused || video.ended) {
      this.playVideo(event, video, mediaId);
      return;
    }

    this.videoUserPausedState = {
      ...this.videoUserPausedState,
      [mediaId]: true
    };
    video.pause();
  }

  onVideoMetadataLoaded(mediaId: number, video: HTMLVideoElement): void {
    const isMuted = this.videoMutedState[mediaId] ?? true;
    video.muted = isMuted;
    this.videoMutedState = {
      ...this.videoMutedState,
      [mediaId]: isMuted
    };
  }

  toggleVideoMute(event: Event, video: HTMLVideoElement, mediaId: number): void {
    event.stopPropagation();
    video.muted = !video.muted;
    this.videoMutedState = {
      ...this.videoMutedState,
      [mediaId]: video.muted
    };
  }

  isVideoMuted(mediaId: number): boolean {
    return this.videoMutedState[mediaId] ?? true;
  }

  toggleVideoFullscreen(event: Event, wrapper: HTMLElement, video: HTMLVideoElement, mediaId: number): void {
    event.stopPropagation();

    if (document.fullscreenElement) {
      document.exitFullscreen()
        .then(() => this.setVideoFullscreen(mediaId, false))
        .catch(() => undefined);
      return;
    }

    if (wrapper.requestFullscreen) {
      wrapper.requestFullscreen()
        .then(() => this.setVideoFullscreen(mediaId, true))
        .catch((error) => {
          console.error('Impossible d’afficher la vidéo en plein écran :', error);
        });
      return;
    }

    const videoWithWebkitFullscreen = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    videoWithWebkitFullscreen.webkitEnterFullscreen?.();
  }

  isVideoFullscreen(mediaId: number): boolean {
    return Boolean(this.videoFullscreenState[mediaId]);
  }

  private setVideoFullscreen(mediaId: number, isFullscreen: boolean): void {
    this.videoFullscreenState = isFullscreen ? { [mediaId]: true } : {};
  }

  private syncFullscreenState(): void {
    const fullscreenMediaId = Number(document.fullscreenElement?.getAttribute('data-video-wrapper-id'));
    this.videoFullscreenState = Number.isFinite(fullscreenMediaId)
      ? { [fullscreenMediaId]: true }
      : {};
  }

  setVideoPlaying(mediaId: number, isPlaying: boolean): void {
    this.videoPlayingState = {
      ...this.videoPlayingState,
      [mediaId]: isPlaying
    };
  }

  isVideoPlaying(mediaId: number): boolean {
    return Boolean(this.videoPlayingState[mediaId]);
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
