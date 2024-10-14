import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '@src/environment';

@Component({
  selector: 'app-policy-privacy',
  templateUrl: './policy-privacy.component.html',
  styleUrls: ['./policy-privacy.component.scss']
})
export class PolicyPrivacyComponent implements OnInit {
  public url = environment.url;
  policyData: any;
  listItems: string[] = [];
  groupedContent: any[] = [];

  constructor(private renderer: Renderer2, private http: HttpClient) {}

  ngOnInit(): void {
    const header = document.querySelector('header');
    if (header) {
      this.renderer.addClass(header, 'header-alt');
    }

    this.getPrivacyPolicy();
  }

  getPrivacyPolicy(): void {
    this.http.get(`${this.url}/api/privacy-policy?populate=*`).subscribe(
      (response: any) => {
        this.policyData = response.data;
        this.groupContentByHeading();
      },
      (error) => {
        console.error('Error fetching privacy policy data:', error);
      }
    );
  }

  groupContentByHeading(): void {
    let currentGroup: any[] = [];

    this.policyData.text.forEach((section: any) => {
      if (section.type === 'heading' && section.level === 2) {
        // Si nous rencontrons un nouveau h2, démarrons un nouveau groupe
        if (currentGroup.length) {
          this.groupedContent.push(currentGroup);
        }
        currentGroup = [section];  // Commence un nouveau groupe avec le nouveau h2
      } else {
        // Ajouter les paragraphes ou autres types dans le groupe actuel
        currentGroup.push(section);
      }
    });

    // Ajouter le dernier groupe après la boucle
    if (currentGroup.length) {
      this.groupedContent.push(currentGroup);
    }
  }
}
