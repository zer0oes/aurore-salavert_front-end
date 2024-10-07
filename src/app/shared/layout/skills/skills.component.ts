import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Competence, Skill } from '@app/models/frontend/project';
import { environment } from '@src/environment';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() skills: Array<Skill> = [];
  @Input() competence: Array<Competence> = [];

  private url = environment.url;

  ngOnInit(): void {
    // Compétences
    this.http.get(`${this.url}/api/competence?populate=*`).subscribe((response: any) => {
      const competenceData = response?.data; // Assurer que response.data existe

      if (competenceData && competenceData.Title) {
        // Ajouter l'objet dans le tableau des compétences
        let newCompetence: Competence = {
          title: competenceData.Title,
          slug: competenceData.slug || 'no-slug', // Fournir un slug si manquant
        };

        this.competence.push(newCompetence);
      } else {
        console.error('Les données de compétence sont manquantes ou mal formées.');
      }
    });



    // Skills
    this.http.get(`${this.url}/api/skills?populate=*`).subscribe((skill: any) => {
      skill.data.forEach((element: any) => {
        let newSkills: Skill = {
          id: element.id,
          title: element.title,
          text: element.text,
          createdAt: element.createdAt,
          icon: this.url + (element.icon?.url || '')
        };

        this.skills.push(newSkills);
      });
    });
  }
}
