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
import { Brand, Category, Product, ProductDto } from '../../core/interfaces/http';
import { ProductsService } from '../../core/service/products.service';
import { CategoryService } from '../../core/service/category.service';
import { BrandService } from '../../core/service/brand.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  categories: Category[] = [];
  brands: Brand[] = [];

  selectedProduct: Product | null = null;


  getCategoryName(id: number): string {
    const c = this.categories.find(x => x.id === id);
    return c ? c.name : '—';
  }

  getBrandName(id: number): string {
    const b = this.brands.find(x => x.id === id);
    return b ? b.name : '—';
  }

  constructor(
    private fb: FormBuilder,
    private svc: ProductsService,
    private categorySvc: CategoryService,
    private brandSvc: BrandService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAll();
    this.loadCategories();
    this.loadBrands();
  }

  private loadCategories() {
    this.categorySvc.getAll().subscribe({
      next: cats => this.categories = cats,
      error: e => console.error('Failed to load categories', e)
    });
  }

  private loadBrands() {
    this.brandSvc.getAllBrand().subscribe({
      next: bs => this.brands = bs,
      error: e => console.error('Failed to load brands', e)
    });
  }
  private initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: [''],
      descriptionAr: [''],
      price: [0, Validators.required],
      taxPercentage: [0],
      categoryId: [null, Validators.required],
      brandId:    [null, Validators.required],
      imageUrl: [''],
      availabilityStatusId: [1]
    });
  }

  private loadAll() {
    this.svc.allProducts().subscribe({
      next: prods => (this.products = prods),
      error: e => console.error(e)
    });
  }

  openModal(p?: Product) {
    if (p) {
      this.selectedProduct = p;
      this.productForm.patchValue({
        ...p,
        nameAr: p.nameAr,
        descriptionAr :p.descriptionAr,
        images: p.imageUrl,
        availabilityStatusId: p.availabilityStatusId
      });
    } else {
      this.selectedProduct = null;
      this.productForm.reset({ availabilityStatusId: 1, images: [] });
    }
  }

  save() {
    if (this.productForm.invalid) return;

    const f = this.productForm.value;
    const dto: ProductDto = {
      id: 0,           // overwritten below for update
      name: f.name,
      nameAr: f.nameAr,
      descriptionEn: f.descriptionEn,
      descriptionAr: f.descriptionAr,
      price: f.price,
      taxPercentage: f.taxPercentage,
      categoryId: f.categoryId,
      creationDate: new Date().toISOString(),
      brandId: f.brandId,
      isActive: true,
      availabilityStatusId :1,
      imageUrl: f.imageUrl
    };

    if (this.selectedProduct) {
      dto.id = this.selectedProduct.id;
      this.svc.update(dto.id, dto).subscribe({
        next: updated => {

          this.closeModal();
        },
        error: e => console.error(e)
      });
    } else {
      this.svc.create(dto).subscribe({
        next: created => {
          this.products.push(created);
          this.closeModal();
        },
        error: e => console.error(e)
      });
    }
  }

  delete(p: Product) {
    // if (!confirm(`Delete ${p.nameEn}?`)) return;
    this.svc.delete(p.id).subscribe({
      next: () => this.products = this.products.filter(x => x.id !== p.id),
      error: e => console.error(e)
    });
  }

  onAvailabilityChange(event: Event) {
    if (!this.selectedProduct) return;

    // figure out the new status from the current value
    const newStatus = this.selectedProduct.availabilityStatusId === 1 ? 0 : 1;

    this.svc.setAvailability(this.selectedProduct.id, newStatus).subscribe({
      next: () => {
        // update locally so UI switches instantly
        this.selectedProduct!.availabilityStatusId = newStatus;
      },
      error: err => console.error('Failed to update availability', err)
    });
  }


  closeModal() {
    // relies on data-bs-dismiss="modal" on your Cancel/Close button
    this.selectedProduct = null;
  }
  toggleAvailability(p: Product) {
    const newStatus = p.availabilityStatusId === 1 ? 0 : 1;
    this.svc.setAvailability(p.id, newStatus).subscribe({
      next: () => {
        p.availabilityStatusId = newStatus;
      },
      error: err => console.error('Availability update failed', err)
    });
  }
}
