import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Skill } from '@app/models/frontend/project';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() title: string = 'What I can do for you and your project';
  @Input() skills: Array<Skill> = [];

  ngOnInit(): void {
    this.http.get('http://localhost:1337/api/skills?populate=*').subscribe((skill: any) => {
      skill.data.forEach((element: any) => {
        let newSkills: Skill = {
          id: element.id,
          title: element.attributes.title,
          text: element.attributes.text,
          createdAt: element.attributes.createdAt,
          icon: 'http://localhost:1337' + element.attributes.icon.data.attributes.url
        }

        this.skills.push(newSkills);
      });
    });
  }
}
