import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../core/interfaces/http';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";


@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavbarComponent],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  selectedProduct: Product | null = null;

  categories = ['Electronics', 'Books', 'Fashion'];
  brands = ['Samsung', 'Apple', 'Sony'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.products = [
      {
        id: 1,
        nameEn: 'Smartphone XYZ',
        nameAr: 'هاتف ذكي XYZ',
        descriptionEn: 'A powerful smartphone',
        descriptionAr: 'هاتف قوي',
        price: 499,
        taxPercentage: 10,
        category: 'Electronics',
        brand: 'Samsung',
        images: [],
        isAvailable: true,
        lastModifiedDate: '2025-04-18',
        lastModifiedBy: 'Admin User'
      }
    ];

    this.initForm();
  }

  initForm() {
    this.productForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: [''],
      descriptionAr: [''],
      price: [0, Validators.required],
      taxPercentage: [0],
      category: ['', Validators.required],
      brand: ['', Validators.required],
      images: [[]], // Later to handle files or URLs
      isAvailable: [true]
    });
  }

  openProductModal(product?: Product) {
    if (product) {
      this.selectedProduct = product;
      this.productForm.patchValue({ ...product });
    } else {
      this.selectedProduct = null;
      this.productForm.reset({ isAvailable: true });
    }
  }

  saveProduct() {
    const formValue = this.productForm.value;

    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p.id === this.selectedProduct!.id);
      this.products[index] = {
        ...this.selectedProduct,
        ...formValue,
        lastModifiedDate: new Date().toISOString().split('T')[0],
        lastModifiedBy: 'Admin User'
      };
    } else {
      const newProduct: Product = {
        id: this.products.length + 1,
        ...formValue,
        lastModifiedDate: new Date().toISOString().split('T')[0],
        lastModifiedBy: 'Admin User'
      };
      this.products.push(newProduct);
    }

    this.productForm.reset({ isAvailable: true });
  }
}
