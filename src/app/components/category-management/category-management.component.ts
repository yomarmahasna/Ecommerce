import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { Category, CategoryDto } from '../../core/interfaces/http';
import { CategoryService } from '../../core/service/category.service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  templateUrl: './category-management.component.html'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  categoryForm!: FormGroup;
  selectedCategory: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  private initForm() {
    this.categoryForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: [''],
      descriptionAr: [''],
      imageUrl: [''],
      isActive: [true]
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe({
      next: cats => (this.categories = cats),
      error: err => console.error('Load categories failed', err)
    });
  }

  openModalForNew() {
    this.selectedCategory = null;
    this.categoryForm.reset({ isActive: true });
  }

  selectCategoryForEdit(cat: Category) {
    this.selectedCategory = cat;
    this.categoryForm.patchValue({ ...cat });
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    const f = this.categoryForm.value;
    const now = new Date().toISOString();

    const dto: CategoryDto = {
      id: this.selectedCategory ? this.selectedCategory.id : 0,
      name: f.nameEn,
      isActive: f.isActive,
      creationDate: this.selectedCategory
        ? this.selectedCategory.creationDate
        : new Date().toISOString(),
      nameAR: f.nameAr,
      descriptionEn: f.descriptionEn,
      descriptionAr: f.descriptionAr,
      imageUrl: f.imageUrl || '  '
    };

    if (this.selectedCategory) {
      // Update
      this.categoryService.update(dto.id, dto).subscribe({
        next: updated => {
          const i = this.categories.findIndex(c => c.id === updated.id);
          if (i > -1) this.categories[i] = updated;
          this.closeModal();
        },
        error: err => console.error('Update failed', err)
      });
    } else {
      // Create
      this.categoryService.create(dto).subscribe({
        next: created => {
          this.categories.push(created);
          this.closeModal();
        },
        error: err => console.error('Create failed', err)
      });
    }
  }

  deleteCategory(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    this.categoryService.delete(cat.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== cat.id);
      },
      error: err => console.error('Delete failed', err)
    });
  }

  toggleActive(cat: Category) {
    const action = cat.isActive ? 'deactivate' : 'activate';
    this.categoryService[action](cat.id).subscribe({
      next: () => {
        cat.isActive = !cat.isActive;
      },
      error: err => console.error(`${action} failed`, err)
    });
  }

  private closeModal() {
    // تفترض وجود زرّ إغلاق داخل المودال بصفة data-bs-dismiss="modal"
    this.selectedCategory = null;
    this.categoryForm.reset({ isActive: true });
  }
}
