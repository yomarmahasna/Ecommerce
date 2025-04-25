import { ProductsService } from './../../core/service/products.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent,RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'];
  products: any[] = [];

  constructor(private productService: ProductsService) {}

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
  }

}
