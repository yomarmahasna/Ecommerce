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
import { Product, ProductDto } from '../../core/interfaces/http';
import { ProductsService } from '../../core/service/products.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminNavbarComponent
  ],
  templateUrl: './product-management.component.html'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  selectedProduct: Product | null = null;

  // replace these with real loads from CategoryService/BrandService if you like
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Fashion' }
  ];
  brands = [
    { id: 1, name: 'Samsung' },
    { id: 2, name: 'Apple' },
    { id: 3, name: 'Sony' }
  ];
/** Returns the display name of a category by its ID */
getCategoryName(id: number): string {
  const c = this.categories.find(x => x.id === id);
  return c ? c.name : '—';
}

/** Returns the display name of a brand by its ID */
getBrandName(id: number): string {
  const b = this.brands.find(x => x.id === id);
  return b ? b.name : '—';
}
  constructor(
    private fb: FormBuilder,
    private svc: ProductsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAll();
  }

  private initForm() {
    this.productForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionEn: [''],
      descriptionAr: [''],
      price: [0, Validators.required],
      taxPercentage: [0],
      categoryId: [null, Validators.required],
      brandId:    [null, Validators.required],
      images:     [[]],
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
        images: p.images,
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
      name: f.nameEn,
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
      imageUrl: f.images || "    "
    };

    if (this.selectedProduct) {
      dto.id = this.selectedProduct.id;
      this.svc.update(dto.id, dto).subscribe({
        next: updated => {
          const i = this.products.findIndex(x => x.id === updated.id);
          if (i > -1) this.products[i] = updated;
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
