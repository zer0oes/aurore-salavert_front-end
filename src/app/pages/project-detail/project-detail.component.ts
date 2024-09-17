import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: any; // Remplace 'any' par ton interface 'Project' si nécessaire

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.http.get(`http://localhost:1337/api/projects?filters[slug][$eq]=${slug}&populate=*`)
        .subscribe((response: any) => {
          if (response.data.length > 0) {
            this.project = response.data[0].attributes; // Assure-toi que les données sont bien structurées
          } else {
            // Gérer le cas où aucun projet n'est trouvé pour ce slug
            console.error('Projet non trouvé');
          }
        });
    }
  }
}
