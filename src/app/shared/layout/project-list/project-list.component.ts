import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, Gallery, Project } from '@app/models/frontend/project';

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

      /**TODO: DEFINE TYPE OF element */
      project.data.forEach((element: any) => {
        let cat: Array<Category> = [];
        /**TODO: DEFINE TYPE OF category */
        element.attributes.categories.data.forEach((category: any) => {
          cat.push({ title: category.attributes.title, slug: category.attributes.slug });
        });

        let gal: Array<Gallery> = [];
        /**TODO: DEFINE TYPE OF item */
        element.attributes.gallery.data.forEach((item: any) => {
          gal.push({ id: item.attributes.id, img: item.attributes.url, alt: item.attributes.alternativeText });
        });

        let newProjects: Project = {
          id: element.id,
          slug: element.attributes.slug,
          title: element.attributes.title,
          description: element.attributes.description,
          createdAt: element.attributes.createdAt,
          thumbnail: 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url,
          categories: cat,
          gallery: gal
        }

        /**TODO: SORT ELEMENTS BY CREATION DATE */
        this.projects.push(newProjects);
        this.projects.sort(function (b, a) {
          return a.createdAt.localeCompare(b.createdAt);
        });
      });
    });
  }
}
