// category-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand, Product, ProductDto } from '../../core/interfaces/http';
import { CategoryService } from '../../core/service/category.service';
import { ProductsService } from '../../core/service/products.service';
import { BrandService } from '../../core/service/brand.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  standalone : true,
  imports: [
    CommonModule,
    FormsModule,           // ← أضفه هنا
  ],
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // ===== بيانات التصنيف =====
  categoryName = '';
  categoryDescription = '';

  // ===== منتجات =====
  allProducts: Product[] = [];
  products: Product[] = [];
  categoryId = 1 ;
  // ===== قائمة الماركات للفلترة =====
  brandList: Brand[] = [];
  brands: string[] = ['All'];
  selectedBrand = 'All';

  // ===== خيارات الفرز =====
  sortOptions = [
    { value: 'priceAsc',  label: 'Price: Low → High' },
    { value: 'priceDesc', label: 'Price: High → Low' },
    { value: 'nameAsc',   label: 'Name: A → Z' },
    { value: 'nameDesc',  label: 'Name: Z → A' },
  ];
  selectedSort = 'priceAsc';

  // ===== Pagination =====
  pageSize     = 6;
  currentPage  = 1;
  totalPages   = 1;

  constructor(
    private route       : ActivatedRoute,
    private category : CategoryService,
    private product  : ProductsService,
    private brand    : BrandService
  ) {}

  ngOnInit(): void {
    // 1. الحصول على الـ ID من المسار
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));



    // 2. جلب بيانات التصنيف
    this.category.getCategoryById(categoryId)
      .subscribe(cat => {
        this.categoryName        = cat.name;
        this.categoryDescription = cat.descriptionEn;
      });

    // 3. جلب كل المنتجات ضمن هذا التصنيف
    this.product.getByCategory(categoryId)
      .subscribe(list => {
        this.allProducts = list;
        this.updateDisplay();
        console.log(this.allProducts)
      });
    // 4. جلب كل الماركات لبناء قائمة الفلترة
    this.brand.getByCategory(categoryId)
    .subscribe(bs => {
      console.log(categoryId)
      console.log(`brand is :${bs.map(b =>b.name)}`)
      this.brandList = bs;
      this.brands = ['All', ...bs.map(b => b.name)];
      });
  }

  // عند تغيير الماركة
  applyBrand(): void {
    this.currentPage = 1;
    this.updateDisplay();
  }

  // عند تغيير طريقة الفرز
  applySort(): void {
    this.currentPage = 1;
    this.updateDisplay();
  }

  // التصفية، الفرز، والتجزئة للعرض
  updateDisplay(): void {
    let filtered = [...this.allProducts];

    // فلترة بالماركة
    if (this.selectedBrand !== 'All') {
      const brand = this.brandList.find(b => b.name === this.selectedBrand);
      filtered = brand
        ? filtered.filter(p => p.brandId === brand.id)
        : filtered;
    }

    // فرز حسب الاختيار
    switch (this.selectedSort) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    // حساب صفحات الـ pagination
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start    = (this.currentPage - 1) * this.pageSize;
    this.products  = filtered.slice(start, start + this.pageSize);
  }

  // الانتقال لصفحة معينة بالـ pagination
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplay();
  }
}
