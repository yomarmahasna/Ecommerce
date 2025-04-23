// src/app/search-results/search-results.component.ts
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
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchResultsComponent implements OnInit {
  // the search term (you might grab this from route params in a real app)
  query = 'Laptop';

  // full product list (could come from an API)
  products: Product[] = [
    { id: 1, name: 'HP Pavilion 15',    price: 799.99, imageUrl: 'https://via.placeholder.com/200', brand: 'HP' },
    { id: 2, name: 'Lenovo ThinkPad',   price: 699.99, imageUrl: 'https://via.placeholder.com/200', brand: 'Lenovo' },
    { id: 3, name: 'Dell XPS 13',       price: 999.99, imageUrl: 'https://via.placeholder.com/200', brand: 'Dell' },
    // …add more samples as needed
  ];

  // filter form
  filterForm: FormGroup;

  // brands extracted from products
  brands: string[] = [];

  // pagination
  pageSizes = [6, 12, 24];
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalPages = 1;
  displayedProducts: Product[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      brand: ['All Brands'],
      priceMin: [null],
      priceMax: [null]
    });
  }

  ngOnInit() {
    this.brands = Array.from(new Set(this.products.map(p => p.brand)));
    this.applyFilters();
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });
  }

  applyFilters() {
    let temp = [...this.products];
    const { brand, priceMin, priceMax } = this.filterForm.value;

    if (brand && brand !== 'All Brands') {
      temp = temp.filter(p => p.brand === brand);
    }
    if (priceMin != null) {
      temp = temp.filter(p => p.price >= priceMin);
    }
    if (priceMax != null) {
      temp = temp.filter(p => p.price <= priceMax);
    }

    this.totalPages = Math.max(1, Math.ceil(temp.length / this.pageSize));
    this.updateDisplayed(temp);
  }

  updateDisplayed(filtered: Product[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedProducts = filtered.slice(start, start + this.pageSize);
  }

  onPageSizeChange(size: string) {
    this.pageSize = +size;
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  // placeholder for add-to-cart action
  addToCart(p: Product) {
    console.log('Add to cart:', p);
  }
}
