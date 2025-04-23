import { Component, OnInit } from '@angular/core';
import { Brand } from '../../core/interfaces/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-brand-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavbarComponent],
  templateUrl: './brand-management.component.html'
})
export class BrandManagementComponent implements OnInit {
  brands: Brand[] = [];
  brandForm!: FormGroup;
  selectedBrand: Brand | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.brands = [
      {
        id: 1,
        nameEn: 'Samsung',
        nameAr: 'سامسونج',
        imageUrl: 'https://via.placeholder.com/60',
        isActive: true
      }
    ];

    this.initForm();
  }

  initForm() {
    this.brandForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      imageUrl: [''],
      isActive: [true]
    });
  }

  openBrandModal(brand?: Brand) {
    if (brand) {
      this.selectedBrand = brand;
      this.brandForm.patchValue({ ...brand });
    } else {
      this.selectedBrand = null;
      this.brandForm.reset({ isActive: true });
    }
  }

  saveBrand() {
    const formValue = this.brandForm.value;

    if (this.selectedBrand) {
      const index = this.brands.findIndex(b => b.id === this.selectedBrand!.id);
      this.brands[index] = {
        ...this.selectedBrand,
        ...formValue
      };
    } else {
      const newBrand: Brand = {
        id: this.brands.length + 1,
        ...formValue,
        imageUrl: formValue.imageUrl || 'https://via.placeholder.com/60'
      };
      this.brands.push(newBrand);
    }

    this.brandForm.reset({ isActive: true });
  }
}
