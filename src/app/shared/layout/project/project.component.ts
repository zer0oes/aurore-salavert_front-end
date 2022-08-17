import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@app/models/frontend/project';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {
  @Input() project: Project;

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {

  }

  public redirectTo(slug: string): void {
    this.route.navigateByUrl('/project?=' + slug);
  }
}
