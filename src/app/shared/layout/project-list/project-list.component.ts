import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Category, Gallery, Project } from '@app/models/frontend/project';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient) { }

  @Input() title: string = 'creative showcase';
  @Input() description: string = 'Discover my ideas and my graphic touch by watching the projects below';
  @Input() projects: Array<Project> = [];

  ngOnInit(): void {
    this.http.get('http://localhost:1337/api/projects?populate=*').subscribe((project: any) => {
  
      project.data.forEach((element: any) => {
        if (element.attributes) {
          // Traitement des catégories
          let cat: Array<Category> = [];
          if (element.attributes.categories?.data) {
            element.attributes.categories.data.forEach((category: any) => {
              cat.push({
                title: category.attributes.title,
                slug: category.attributes.slug
              });
            });
          }
  
          // Traitement de la galerie
          let gal: Array<Gallery> = [];
          if (element.attributes.gallery?.data) {
            element.attributes.gallery.data.forEach((item: any) => {
              gal.push({
                id: item.id,
                img: 'http://localhost:1337' + item.attributes.url,
                alt: item.attributes.alternativeText || 'Image'
              });
            });
          }
  
          // Création du projet
          let newProject: Project = {
            id: element.id,
            slug: element.attributes.slug,
            title: element.attributes.title,
            description: element.attributes.description,
            createdAt: element.attributes.createdAt,
            thumbnail: element.attributes.thumbnail?.data ? 'http://localhost:1337' + element.attributes.thumbnail.data.attributes.url : '',
            categories: cat,
            layout: element.attributes.layout?.data?.attributes?.slug || '', // Vérifie que c'est bien un slug
            gallery: gal
          }
  
          // Ajoute le projet à la liste des projets et trie par date
          this.projects.push(newProject);
          this.projects.sort((b, a) => a.createdAt.localeCompare(b.createdAt));
        }
      });
    });
  }
  
}
