import { Component, OnInit } from '@angular/core';
import { ProjectService } from './services/project.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private projectService: ProjectService) { }
  
  ngOnInit(): void {
    this.projectService.fetchProjects().pipe(take(1)).subscribe();
  }
}
