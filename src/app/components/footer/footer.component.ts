import { Component, OnInit } from '@angular/core';
import { SocialNetworkService } from '@app/services/social-network.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  socialNetworks: any[] = [];

  constructor(private socialNetworkService: SocialNetworkService) { }

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
  }
}
