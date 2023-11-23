import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Skill } from '@app/models/frontend/project';
import { Observable, catchError } from 'rxjs';
import { DEV_API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private apiSkills = `${DEV_API_URL}skills`;
  
  constructor(private http: HttpClient) { }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiSkills}?populate=*`).pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error; // Rethrow the error
      })
    );
  }
}
