import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, Project } from '@app/models/frontend/project';
import { BoProject } from '@app/models/backend/project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() title: string = 'creative showcase';
  @Input() description: string = 'Discover my ideas and my graphic touch by watching the projects below';
  @Input() projects: Array<Project> = [];

  ngOnInit(): void {
    /**TODO: DEFINE TYPE OF project */
    this.http.get('http://localhost:1337/api/projects?populate=*').subscribe((project: any) => {
      console.log('project : ', project);

      /**TODO: DEFINE TYPE OF element */
      project.data.forEach((element: any) => {
        console.log('element : ', element);
        let cat: Array<Category> = []

        /**TODO: DEFINE TYPE OF category */
        element.attributes.categories.data.forEach((category: any) => {
          console.log('category : ', category);
          cat.push({ title: category.attributes.title, slug: category.attributes.slug });
        });

        let newProjects: Project = {
          id: element.id,
          slug: element.attributes.slug,
          title: element.attributes.title,
          description: element.attributes.description,
          createdAt: element.attributes.createdAt,
          thumbnail: 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url,
          categories: cat
        }

        /**TODO: SORT ELEMENTS BY CREATION DATE */
        this.projects.push(newProjects);
      });
    });
  }
}
