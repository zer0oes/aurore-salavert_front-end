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
      this.socialNetworks = response.data;
      console.log('Social Networks:', this.socialNetworks);
    });
  }
}
