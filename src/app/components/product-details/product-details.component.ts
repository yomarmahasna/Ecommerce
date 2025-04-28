import { CartService } from './../../core/service/cart.service';
import { WishlistService } from './../../core/service/wishlist.service';
import { ProductsService } from './../../core/service/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyProduct } from '../../core/interfaces/http';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  readonly defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';
  productId!: string;
  product: any;
  relatedProducts: any[] = [];
  addedToWishlist: boolean = false;
  query = '';
  constructor(
    private route: ActivatedRoute,
    private ProductsService: ProductsService,
    private cartService:CartService ,
    private wishlistService: WishlistService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      // now reload your products based on this.query…
    });
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.getProductDetails(this.productId);
    this.getRelatedProducts();
  }
  addToCart(product: MyProduct): void {
    this.cartService.addToCart(product);
  }
  addToWishlist(product: MyProduct): void {
    if (!this.addedToWishlist) {
      this.wishlistService.addToWishlist(product);
      this.addedToWishlist = true;
    } else {
      this.router.navigate(['/customer/wishlist']);
    }
  }

  getProductDetails(id: string): void {
    this.ProductsService.getDetails(id).subscribe({
      next: (res) => {
        this.product = res;
      },
      error: (err) => console.log(err),
    });
  }

  getRelatedProducts(): void {
    this.ProductsService.allProducts().subscribe({
      next: (res) => {
        this.relatedProducts = res ;
      },
      error: (err) => console.log(err),
    });
  }

}
