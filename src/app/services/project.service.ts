import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '@app/models/frontend/project';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('http://localhost:1337/api/projects?populate=*').pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error; // Rethrow the error
      })
    );
  }
}