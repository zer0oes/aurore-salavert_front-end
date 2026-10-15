import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  readonly isFrench = this.localeService.getLocale() === 'fr';
  private previousTitle = '';
  private previousRobots: string | null = null;

  constructor(private localeService: LocaleService, private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.previousTitle = this.title.getTitle();
    this.previousRobots = this.meta.getTag('name="robots"')?.content ?? null;
    this.title.setTitle(`${this.isFrench ? 'Page introuvable' : 'Page not found'} | Aurore Salavert`);
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    document.body.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  ngOnDestroy(): void {
    this.title.setTitle(this.previousTitle);
    if (this.previousRobots === null) {
      this.meta.removeTag('name="robots"');
    } else {
      this.meta.updateTag({ name: 'robots', content: this.previousRobots });
    }
  }
}
