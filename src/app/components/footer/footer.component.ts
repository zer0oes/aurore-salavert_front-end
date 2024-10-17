import { Component, OnInit } from '@angular/core';
import { SocialNetworkService } from '@app/services/social-network.service';
import { PrivacyPolicyService } from '@app/services/privacy-policy.service';
import { LocaleService } from '@app/services/locale.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  socialNetworks: any[] = [];
  privacyPolicyLink: string | null = null;
  privacyPolicyTitle: string | null = null;

  constructor(
    private socialNetworkService: SocialNetworkService,
    private privacyPolicyService: PrivacyPolicyService,
    private localeService: LocaleService
  ) { }

  ngOnInit(): void {
    this.socialNetworkService.getSocialNetworks().subscribe((response: any) => {
      if (response && response.data) {
        this.socialNetworks = response.data.map((network: any) => ({
          icon: network.icon,
          url: network.url
        }));
      } else {
        console.error('Erreur: Aucune donnée trouvée dans la réponse de l\'API');
      }
    });

    const locale = this.localeService.getLocale();
    this.privacyPolicyService.getPrivacyPolicy(locale).subscribe((response: any) => {
      if (response && response.data) {
        this.privacyPolicyLink = '/privacy-policy';
        this.privacyPolicyTitle = response.data.title;
      } else {
        console.error('Erreur: Aucune donnée trouvée dans la réponse de l\'API');
      }
    });
  }
}
