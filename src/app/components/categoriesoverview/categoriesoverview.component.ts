import { Component } from '@angular/core';
import { CategoryDto } from '../../core/interfaces/http';
import { CategoryService } from '../../core/service/category.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoriesoverview',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './categoriesoverview.component.html',
  styleUrl: './categoriesoverview.component.css'
})
export class CategoriesoverviewComponent {
  categories: CategoryDto[] = [];

  constructor(private category: CategoryService) {}

  ngOnInit(): void {
    this.category.getAll().subscribe(data => {
      this.categories = data;
    });
  }

}
