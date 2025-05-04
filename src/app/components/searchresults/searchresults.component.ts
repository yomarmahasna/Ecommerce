import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ProductsService } from '../../core/service/products.service';
import { Product } from '../../core/interfaces/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-search-results',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  query: string = '';
  noResults = false;

  constructor(private route: ActivatedRoute, private productService: ProductsService,router :Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = (params['q'] || '').toLowerCase();
      if (this.query) {
        this.productService.allProducts().subscribe(data => {
          this.products = data;
          this.filteredProducts = this.products.filter(p =>
            p.name.toLowerCase().includes(this.query) ||
            p.descriptionEn?.toLowerCase().includes(this.query) ||
            p.descriptionAr?.toLowerCase().includes(this.query)
          );
          this.noResults = this.filteredProducts.length === 0;
        });
      }
    });
  }



  // Optional: Reset filter
  clearSearch() {
    this.filteredProducts = [...this.products];
    this.query = '';
  }
}
