import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '@app/models/frontend/project';
import { Observable, catchError, map } from 'rxjs';
import { DEV_API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiProjects = `${DEV_API_URL}projects`;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiProjects}?populate=*`).pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error; // Rethrow the error
      })
    );
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiProjects}/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error;
      })
    );
  }

  getProjectIdBySlug(slug: string): Observable<number> {
    return this.http.get<any>(`${this.apiProjects}?slug=${slug}`).pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error;
      }),
      map(response => {
        console.log('API Response:', response);
  
        // Assuming the response is an object with a 'data' property
        const projects = response.data;
  
        // Find the project with the matching slug
        const matchingProject = projects.find((project: any) => project.attributes.slug === slug);
  
        if (matchingProject) {
          return matchingProject.id;
        } else {
          throw new Error('Project ID not found for slug: ' + slug);
        }
      })
    );
  }
}
