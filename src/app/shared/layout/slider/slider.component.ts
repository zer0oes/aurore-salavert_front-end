import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { SliderItems } from '@app/models/frontend/project';
import { environment } from '@src/environment';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  constructor(private http: HttpClient, private localeService: LocaleService, private element: ElementRef<HTMLElement>) {}

  private contrastFrame = 0;
  private destroyed = false;
  private sampledImages = new Map<string, Promise<HTMLImageElement>>();

  @HostListener('window:resize')
  updateContrast(): void {
    cancelAnimationFrame(this.contrastFrame);
    this.contrastFrame = requestAnimationFrame(() => this.measureContrast());
  }

  private async measureContrast(): Promise<void> {
    const slide = this.element.nativeElement.querySelector<HTMLElement>('.slide-active');
    if (!slide || this.destroyed) return;
    const targets = Array.from(slide.querySelectorAll<HTMLElement>('.slide-secondary'));
    const hook = slide.querySelector<HTMLElement>('.slide-hook');
    hook?.classList.remove('auto-contrast');
    hook?.style.removeProperty('background-image');
    targets.forEach(target => target.style.removeProperty('color'));
    if (!window.matchMedia('(max-width: 600px)').matches) return;
    const displayedImage = slide.querySelector<HTMLImageElement>('img');
    if (!displayedImage?.naturalWidth) return;
    const source = displayedImage.currentSrc || displayedImage.src;
    if (!this.sampledImages.has(source)) {
      this.sampledImages.set(source, new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = source;
      }));
    }
    try {
      const image = await this.sampledImages.get(source)!;
      if (this.destroyed || !slide.classList.contains('slide-active') || !window.matchMedia('(max-width: 600px)').matches) return;
      const bounds = displayedImage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // Match the centered object-fit: cover crop, rather than the whole image.
      const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
      const offsetX = (image.naturalWidth * scale - bounds.width) / 2;
      const offsetY = (image.naturalHeight * scale - bounds.height) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 24;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      const linear = (value: number) => {
        const s = value / 255;
        return s <= .04045 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
      };
      const darkLuminance = .2126 * linear(44) + .7152 * linear(41) + .0722 * linear(41);
      if (hook) {
        const rect = hook.getBoundingClientRect();
        if (rect.width && rect.height) {
          // A low-resolution luminance map produces soft neutral transitions
          // across the text, without inverting the photograph's colors.
          const gradient = document.createElement('canvas');
          gradient.width = 80;
          gradient.height = Math.max(1, Math.round(80 * rect.height / rect.width));
          const paint = gradient.getContext('2d');
          if (paint) {
            paint.drawImage(image, (rect.left - bounds.left + offsetX) / scale,
              (rect.top - bounds.top + offsetY) / scale, rect.width / scale, rect.height / scale,
              0, 0, gradient.width, gradient.height);
            const map = paint.getImageData(0, 0, gradient.width, gradient.height);
            for (let i = 0; i < map.data.length; i += 4) {
              const light = .2126 * linear(map.data[i]) + .7152 * linear(map.data[i + 1]) + .0722 * linear(map.data[i + 2]);
              const t = Math.max(0, Math.min(1, (light - .10) / .22));
              const blend = t * t * (3 - 2 * t);
              map.data[i] = Math.round(255 + (44 - 255) * blend);
              map.data[i + 1] = map.data[i + 2] = Math.round(255 + (41 - 255) * blend);
              map.data[i + 3] = 255;
            }
            paint.putImageData(map, 0, 0);
            hook.style.backgroundImage = `url("${gradient.toDataURL()}")`;
            hook.classList.add('auto-contrast');
          }
        }
      }
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        context.clearRect(0, 0, 24, 24);
        context.drawImage(image, (rect.left - bounds.left + offsetX) / scale,
          (rect.top - bounds.top + offsetY) / scale, rect.width / scale, rect.height / scale, 0, 0, 24, 24);
        const pixels = context.getImageData(0, 0, 24, 24).data;
        let lightScore = 0;
        let darkScore = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const luminance = .2126 * linear(pixels[i]) + .7152 * linear(pixels[i + 1]) + .0722 * linear(pixels[i + 2]);
          lightScore += Math.log(1.05 / (luminance + .05));
          darkScore += Math.log((Math.max(luminance, darkLuminance) + .05) / (Math.min(luminance, darkLuminance) + .05));
        }
        target.style.color = lightScore > darkScore ? '#ffffff' : '#2C2929';
      }
    } catch {
      // Keep the editorial theme if the media server disallows pixel access.
    }
  }

  get english(): boolean { return this.localeService.getLocale() === 'en'; }

  @Input() images: Array<SliderItems> = [];
  @Input() selectedIndex: number = 0;
  previousIndex = -1;
  slideDirection: 'next' | 'previous' = 'next';
  @Input() dots: boolean = true;
  @Input() arrows: boolean = true;
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 25000;
  @Input() slideIntervalId: any;

  private url = environment.url;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private swipeThreshold: number = 50;

  ngOnInit(): void {
    const query = 'status=published&populate[Slides][populate][Image]=true&populate[Slides][populate][Project]=true';
    this.http.get(`${this.url}/api/slider-item?${query}`).subscribe({
      next: (response: any) => {
        const data = response?.data;
        const positions = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'];
        const slides = (data?.Slides || []).filter((slide: any) => slide.Image?.url && slide.Image.mime?.startsWith('image/'));
        this.images = slides.length ? slides.map((slide: any) => ({
          imgSrc: this.mediaUrl(slide.Image.url),
          imgAlt: slide.Image.alternativeText || slide.Project?.title || '',
          projectSlug: slide.Project?.publishedAt ? slide.Project.slug : undefined,
          projectTitle: slide.Project?.title,
          accroche: this.renderBlocks(slide.Accroche),
          position: positions.includes(slide.Position) ? slide.Position : 'bottom-left',
          theme: slide.Theme === 'dark' ? 'dark' : 'light',
        })) : (data?.Gallery || []).filter((image: any) => image.url && image.mime?.startsWith('image/')).map((image: any) => ({
          imgSrc: this.mediaUrl(image.url), imgAlt: image.alternativeText || '',
        }));
        this.selectedIndex = 0;
        this.updateContrast();
        if (this.autoSlide && this.images.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.autoSlideImages();
      },
      error: (error) => console.error('Impossible de charger les slides.', error),
    });
  }

  private mediaUrl(url: string): string {
    return url.startsWith('http') ? url : this.url + url;
  }

  // Escape CMS text before generating markup; Angular also sanitizes innerHTML.
  private renderBlocks(nodes: any[]): string {
    if (!Array.isArray(nodes)) return '';
    return nodes.map(node => {
      if (typeof node.text === 'string') {
        const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        let text = escape(node.text).replace(/\n/g, '<br>');
        if (node.bold) text = `<strong>${text}</strong>`;
        if (node.italic) text = `<em>${text}</em>`;
        if (node.underline) text = `<u>${text}</u>`;
        if (node.strikethrough) text = `<s>${text}</s>`;
        return text;
      }
      const children = this.renderBlocks(node.children);
      if (node.type === 'list') return node.format === 'ordered' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`;
      if (node.type === 'list-item') return `<li>${children}</li>`;
      if (node.type === 'link') return children;
      return `<p>${children}</p>`;
    }).join('');
  }

  scrollToSection(event: Event, id: string): void {
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    this.pauseSlider();
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.contrastFrame);
    this.pauseSlider();
  }

  selectImage(index: number): void {
    if (index === this.selectedIndex) return;
    this.previousIndex = this.selectedIndex;
    this.slideDirection = index > this.selectedIndex ? 'next' : 'previous';
    this.selectedIndex = index;
    this.updateContrast();
    this.pauseSlider();
  }

  onPrevClick(): void {
    if (this.images.length < 2) return;
    this.previousIndex = this.selectedIndex;
    this.slideDirection = 'previous';
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.images.length - 1;
    } else {
      this.selectedIndex--;
    }
    this.pauseSlider();
    this.updateContrast();
  }

  onNextClick(fromAutoSlide: boolean = false): void {
    if (this.images.length < 2) return;
    this.previousIndex = this.selectedIndex;
    this.slideDirection = 'next';
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
    if (!fromAutoSlide) {
      this.pauseSlider();
    }
    this.updateContrast();
  } 

  autoSlideImages(): void {
    this.pauseSlider();
    this.slideIntervalId = setInterval(() => {
      this.onNextClick(true);
    }, this.slideInterval);
  }

  pauseSlider(): void {
    clearInterval(this.slideIntervalId);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (swipeDistance > this.swipeThreshold) {
      this.onNextClick();
    } else if (swipeDistance < -this.swipeThreshold) {
      this.onPrevClick();
    }
  }
}
