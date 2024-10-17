import { Component, OnInit } from '@angular/core';
import { SocialNetworkService } from '@app/services/social-network.service';
import { PrivacyPolicyService } from '@app/services/privacy-policy.service';

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
    private privacyPolicyService: PrivacyPolicyService
  ) { }

  ngOnInit(): void {
    // Récupérer les réseaux sociaux
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

    // Récupérer la Privacy Policy
    this.privacyPolicyService.getPrivacyPolicy().subscribe((response: any) => {
      if (response && response.data) {
        this.privacyPolicyLink = `/privacy-policy/${response.data.slug}`;
        this.privacyPolicyTitle = response.data.title;
      } else {
        console.error('Erreur: Aucune donnée trouvée dans la réponse de l\'API');
      }
    });
  }
}