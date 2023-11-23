import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Skill } from '@app/models/frontend/project';
import { SkillsService } from '@app/services/skills.service';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  constructor(private http: HttpClient, private skillsService: SkillsService) { }

  @Input() title: string = 'What I can do for you and your project';
  @Input() skills: Array<Skill> = [];

  ngOnInit(): void {
    this.skillsService.getSkills().subscribe(
      (response: any) => {
        if (Array.isArray(response.data)) {
          this.skills = response.data.map((element: any) => {
            return {
              id: element.id,
              title: element.attributes.title,
              text: element.attributes.text,
              createdAt: element.attributes.createdAt,
              icon: 'http://localhost:1337' + element.attributes.icon.data.attributes.url
            };
          });
        }
      },
      (error: any) => {
        console.error('Error during HTTP request:', error);
        // Handle the error as needed
      }
    );
  }
}
