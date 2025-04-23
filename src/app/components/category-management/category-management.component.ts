import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../core/interfaces/http';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavbarComponent],
  templateUrl: './category-management.component.html'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [
    {
      id: 1,
      nameEn: 'Electronics',
      nameAr: 'إلكترونيات',
      descriptionEn: 'Devices and gadgets',
      descriptionAr: 'أجهزة وإلكترونيات',
      imageUrl: 'https://via.placeholder.com/60',
      isActive: true
    }
  ];

  categoryForm!: FormGroup;
  selectedCategory: Category | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: [''],
      descriptionAr: [''],
      imageUrl: [''], // Placeholder for now
      isActive: [true]
    });
  }

  selectCategoryForEdit(category: Category) {
    this.selectedCategory = category;
    this.categoryForm.patchValue({ ...category });
  }

  saveCategory() {
    const formValue = this.categoryForm.value;

    if (this.selectedCategory) {
      // Edit existing
      const index = this.categories.findIndex(c => c.id === this.selectedCategory!.id);
      if (index !== -1) {
        this.categories[index] = { ...this.selectedCategory, ...formValue };
      }
    } else {
      // Create new
      const newCategory: Category = {
        id: this.categories.length + 1,
        ...formValue,
        imageUrl: formValue.imageUrl || 'https://via.placeholder.com/60'
      };
      this.categories.push(newCategory);
    }

    this.categoryForm.reset({ isActive: true });
    this.selectedCategory = null;
  }
}
