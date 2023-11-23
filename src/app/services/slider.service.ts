import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DEV_API_URL } from './constants';
import { Observable, catchError } from 'rxjs';
import { SliderItems } from '@app/models/frontend/project';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private apiSlider = `${DEV_API_URL}slider-item`;
  
  constructor(private http: HttpClient) { }

  getSlider(): Observable<SliderItems[]> {
    return this.http.get<SliderItems[]>(`${this.apiSlider}?populate=*`).pipe(
      catchError((error: any) => {
        console.error('Error during HTTP request:', error);
        throw error; // Rethrow the error
      })
    );
  }
}
