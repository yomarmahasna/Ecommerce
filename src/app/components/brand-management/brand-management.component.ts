import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../core/service/brand.service';
import { Brand, CreateBrandDto, UpdateBrandDto } from '../../core/interfaces/http';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";
import { time } from 'node:console';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DataTableComponent } from '../shared/data-table/data-table.component';

@Component({
  selector: 'app-brand-management',
  standalone: true,
  templateUrl: './brand-management.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTableComponent
    ]
})
export class BrandManagementComponent implements OnInit {
  brands: Brand[] = [];
  brandForm!: FormGroup;
  selectedBrand: Brand | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBrands();
  }

  private initForm(): void {
    this.brandForm = this.fb.group({
      nameEn:   ['', Validators.required],
      nameAr:   ['', Validators.required],
      imageUrl: [''],
      isActive: [true]
    });
  }

  /** يجلب كل الماركات من الـ API */
  loadBrands(): void {
    this.loading = true;
    this.brandService.getAllBrand().subscribe({
      next: data => {
        this.brands = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'فشل جلب الماركات';
        this.loading = false;
      }
    });
  }

  /** يفتح المودال للإضافة أو التعديل */
  openBrandModal(brand?: Brand): void {
    this.error = null;
    if (brand) {
      this.selectedBrand = brand;
      this.brandForm.patchValue(brand);
    } else {
      this.selectedBrand = null;
      this.brandForm.reset({ isActive: true, nameEn: '', nameAr: '', imageUrl: '' });
    }
  }

  /** يرسل الطلب المناسب للإنشاء أو التحديث */
  saveBrand(): void {
    if (this.brandForm.invalid) return;

    const v = this.brandForm.value;
    if (this.selectedBrand) {
      const dto: UpdateBrandDto = {
        id:        this.selectedBrand.id,
        name:    v.nameEn,
        nameAr:    v.nameAr,
        imageUrl:  v.imageUrl,
        isActive:  v.isActive,
        creationDate: new Date().toISOString()
      };
      this.brandService.updateBrand(dto.id, dto).subscribe({
        next: () => {
          // نحدث العنصر في الذاكرة ليظهر التعديل فوراً
          Object.assign(this.selectedBrand!, dto);
        },
        error: err => {
          console.error(err);
          this.error = 'فشل تحديث الماركة';
        }
      });
    } else {
      const dto: CreateBrandDto = {
        // id : v.id ,
        name:   v.nameEn,
        nameAr:   v.nameAr,
        imageUrl: v.imageUrl,
        isActive: v.isActive,
        creationDate: new Date().toISOString()

      };
      this.brandService.createBrand(dto).subscribe({
        next: newBrand => {
          this.brands.push(newBrand);
        },
        error: err => {
          console.error(err);
          this.error = 'فشل إنشاء الماركة';
        }
      });
    }
  }
}
