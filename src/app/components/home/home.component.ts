import { ProductsService } from './../../core/service/products.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CategoryDto } from '../../core/interfaces/http';
import { CategoryService } from '../../core/service/category.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent,RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  categories: CategoryDto[] = [];
  products: any[] = [];

  constructor(private productService: ProductsService ,private category: CategoryService) {}

  ngOnInit(): void {

    this.productService.allProducts().subscribe({
      next: (data) => {
        // Limit products for demonstration
        console.log(`product is ${this.products}`)
        this.products = data;

      },
      error: (err) => {
        console.log('Error fetching products:', err);
      }
    });
    this.category.getAll().subscribe(data => {
      this.categories = data;
    });
  }

}
