import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Competence, Skill } from '@app/models/frontend/project';
import { LocaleService } from '@app/services/locale.service';
import { environment } from '@src/environment';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  constructor(private http: HttpClient, private localeService: LocaleService) { }

  @Input() skills: Array<Skill> = [];
  @Input() competence: Array<Competence> = [];

  private url = environment.url;

  ngOnInit(): void {
    const locale = this.localeService.getLocale();
    // Compétences
    this.http.get(`${this.url}/api/competence?populate=*&locale=${locale}`).subscribe((response: any) => {
      const competenceData = response?.data;

      if (competenceData && competenceData.Title) {
        let newCompetence: Competence = {
          title: competenceData.Title,
          slug: competenceData.slug || 'no-slug',
        };

        this.competence.push(newCompetence);
      } else {
        console.error('Les données de compétence sont manquantes ou mal formées.');
      }
    });

    // Skills
    this.http.get(`${this.url}/api/skills?populate=*&locale=${locale}&sort=order:asc`).subscribe((skill: any) => {
      skill.data.forEach((element: any) => {
        let newSkills: Skill = {
          id: element.id,
          title: element.title,
          text: element.text,
          createdAt: element.createdAt,
          icon: element.icon?.url?.startsWith('http') ? element.icon.url : this.url + (element.icon?.url || '')
        };

        this.skills.push(newSkills);
      });
    });
  }
}
