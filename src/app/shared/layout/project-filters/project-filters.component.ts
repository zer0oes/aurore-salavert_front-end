import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Category } from '@app/models/frontend/project';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss']
})
export class ProjectFiltersComponent {
  constructor(private http: HttpClient) { }

  @Input() categories: Array<Category> = [];

  ngOnInit(): void {
    this.http.get('http://localhost:1337/api/categories?populate=*').subscribe((category: any) => {
      const categoriesData: Array<any> = category.data;
      this.categories = categoriesData.map((element: any) => ({
        title: element.attributes.title,
        slug: element.attributes.slug,
      }));

      this.categories.sort((a: Category, b: Category) => {
        return a.slug.localeCompare(b.slug);
      });
    });
  }
}
