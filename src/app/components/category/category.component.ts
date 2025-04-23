// src/app/category/category.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NavbarComponent } from "../shared/navbar/navbar.component";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  brand: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // 1. Category info
  categoryName = 'Electronics';
  categoryDescription = 'A curated selection of top-quality electronic products.';

  // 2. Full product list (you could fetch this from a service)
  products: Product[] = [
    { id: 1, name: 'Headphones', price: 99, imageUrl: 'https://via.placeholder.com/200', brand: 'Brand A' },
    { id: 2, name: 'Smartphone', price: 499, imageUrl: 'https://via.placeholder.com/200', brand: 'Brand B' },
    { id: 3, name: 'Laptop', price: 899, imageUrl: 'https://via.placeholder.com/200', brand: 'Brand C' },
    // …add as many sample items as you like
  ];

  // intermediate & displayed lists
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];

  // unique brands for filter checkboxes
  brands: string[] = [];

  // sorting options
  sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' }
  ];
  selectedSort = '';

  // pagination settings
  pageSizes = [20, 50, 100];
  pageSize = 20;
  currentPage = 1;
  totalPages = 1;

  // reactive form for filters
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      brands: this.fb.group({}),   // will add controls dynamically
      priceMin: [null],
      priceMax: [null]
    });
  }

  ngOnInit(): void {
    // build brand checkboxes
    this.brands = Array.from(new Set(this.products.map(p => p.brand)));
    const brandsGroup = this.filterForm.get('brands') as FormGroup;
    this.brands.forEach(b => brandsGroup.addControl(b, this.fb.control(false)));

    // apply initial filter/sort/pagination
    this.applyAll();

    // re-apply whenever filters change
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyAll();
    });
  }

  applyAll() {
    // FILTER
    let temp = this.products;
    const { brands, priceMin, priceMax } = this.filterForm.value;
    const activeBrands = this.brands.filter(b => brands[b]);
    if (activeBrands.length) {
      temp = temp.filter(p => activeBrands.includes(p.brand));
    }
    if (priceMin != null) {
      temp = temp.filter(p => p.price >= priceMin);
    }
    if (priceMax != null) {
      temp = temp.filter(p => p.price <= priceMax);
    }

    // SORT
    switch (this.selectedSort) {
      case 'price_asc':
        temp = temp.slice().sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        temp = temp.slice().sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        temp = temp.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        temp = temp.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    this.filteredProducts = temp;

    // PAGINATION
    this.totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
    this.updateDisplayed();
  }

  updateDisplayed() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedProducts = this.filteredProducts.slice(start, start + this.pageSize);
  }

  onSortChange(value: string) {
    this.selectedSort = value;
    this.applyAll();
  }

  onPageSizeChange(value: string) {
    this.pageSize = +value;
    this.currentPage = 1;
    this.applyAll();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayed();
  }
}
