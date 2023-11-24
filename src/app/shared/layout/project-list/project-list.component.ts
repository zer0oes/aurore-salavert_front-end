import { Component, Input, OnInit } from '@angular/core';
import { Project } from '@app/models/frontend/project';
import { ProjectService } from '@app/services/project.service';
import { take } from 'rxjs';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  constructor(private projectService: ProjectService) { }

  @Input() title: string = 'creative showcase';
  @Input() description: string = 'Discover my ideas and my graphic touch by watching the projects below';
  projects: Array<Project> = [];

  ngOnInit(): void {
    this.projectService.projects.pipe(take(1)).subscribe(
      (data: any) => {
        this.projects = data;
      }
    );

















  //   this.projectService.getProjects().subscribe(
  //     (response: any) => {
  //       if (Array.isArray(response.data)) {
  //         this.projects = response.data.map((element: any) => {
  //           const cat = element.attributes.categories.data.map((category: any) => ({
  //             title: category.attributes.title,
  //             slug: category.attributes.slug,
  //           }));

  //           const gal = element.attributes.gallery.data.map((item: any) => ({
  //             id: item.attributes.id,
  //             img: item.attributes.url,
  //             alt: item.attributes.alternativeText,
  //           }));

  //           return {
  //             id: element.id,
  //             slug: element.attributes.slug,
  //             title: element.attributes.title,
  //             description: element.attributes.description,
  //             createdAt: element.attributes.createdAt,
  //             thumbnail: 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url,
  //             categories: cat,
  //             layout: element.attributes.layout.data.attributes.slug,
  //             gallery: gal,
  //           };
  //         });

  //         this.projects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));

  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error during HTTP request:', error);
  //       // Handle the error as needed
  //     }
  //   );
  }
}
