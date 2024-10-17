import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@src/environment';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'app-policy-privacy',
  templateUrl: './policy-privacy.component.html',
  styleUrls: ['./policy-privacy.component.scss']
})
export class PolicyPrivacyComponent implements OnInit {
  public url = environment.url;
  policyData: any;
  groupedContent: any[] = [];

  constructor(
    private renderer: Renderer2,
    private metaService: Meta,
    private titleService: Title,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const header = document.querySelector('header');
    if (header) {
      this.renderer.addClass(header, 'header-alt');
    }

    this.route.data.subscribe((data) => {
      this.policyData = data['policyData'].data;
      this.updateTitleWithPolicyData();
      this.groupContentByHeading();
    });
  }

  updateTitleWithPolicyData(): void {
    if (this.policyData && this.policyData.title) {
      const policyTitle = this.policyData.title || 'Privacy Policy';
      this.titleService.setTitle(`${policyTitle} - Aurore Salavert - Enthusiastic Graphic & Web developer - Paris, France`);
      this.metaService.updateTag({ name: 'description', content: 'Learn more about the privacy policy of Aurore Salavert, graphic and web developer based in Paris, France. Understand how your data is collected, used, and protected.' });
      this.metaService.updateTag({ name: 'keywords', content: 'Privacy Policy, Data Protection, Aurore Salavert, Graphic Designer, Web Developer, Paris' });
      this.metaService.updateTag({ property: 'og:title', content: `${policyTitle} - Aurore Salavert - Enthusiastic Graphic & Web developer - Paris, France` });
      this.metaService.updateTag({ property: 'og:description', content: 'Learn more about the privacy policy of Aurore Salavert, graphic and web developer based in Paris, France.' });
      this.metaService.updateTag({ property: 'og:url', content: 'https://aurore-salavert.fr/privacy-policy' });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
      this.metaService.updateTag({ name: 'twitter:title', content: `${policyTitle} - Aurore Salavert - Enthusiastic Graphic & Web developer - Paris, France` });
      this.metaService.updateTag({ name: 'twitter:description', content: 'Learn more about the privacy policy of Aurore Salavert, graphic and web developer based in Paris, France.' });
    }
  }

  groupContentByHeading(): void {
    let currentGroup: any[] = [];

    this.policyData.text.forEach((section: any) => {
      if (section.type === 'heading' && section.level === 2) {
        if (currentGroup.length) {
          this.groupedContent.push(currentGroup);
        }
        currentGroup = [section];
      } else {
        currentGroup.push(section);
      }
    });

    if (currentGroup.length) {
      this.groupedContent.push(currentGroup);
    }
  }
}
