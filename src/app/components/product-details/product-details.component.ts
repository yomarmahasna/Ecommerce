import { CartService } from './../../core/service/cart.service';
import { WishlistService } from './../../core/service/wishlist.service';
import { ProductsService } from './../../core/service/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyProduct, ProductReview } from '../../core/interfaces/http';
import { ProductReviewService } from '../../core/service/product-review.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  readonly defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';
  productId!: number;
  product: any;
  relatedProducts: any[] = [];
  addedToWishlist: boolean = false;
  addedToCart: boolean = false;
  query = '';
  reviews:ProductReview[] = []
  constructor(
    private route: ActivatedRoute,
    private ProductsService: ProductsService,
    private cartService:CartService ,
    private wishlistService: WishlistService,
    private reviewService: ProductReviewService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      // now reload your products based on this.query…
    });
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.getProductDetails(this.productId);
    this.getRelatedProducts();
        // حمّل التعليقات
        this.reviewService.getReviewByProductId(this.productId).subscribe({
          next: rev => this.reviews = rev.slice(0, 10),
          error: err => console.error(err)
        });
  }
  addToCart(product: MyProduct): void {
    if (!this.addedToCart) {
    this.cartService.addToCart(product);
    this.addedToCart = true;
  } else {
    this.router.navigate(['/customer/shopping-cart']);
  }
  }
  addToWishlist(product: MyProduct): void {
    if (!this.addedToWishlist) {
      this.wishlistService.addToWishlist(product);
      this.addedToWishlist = true;
    } else {
      this.router.navigate(['/customer/wishlist']);
    }
  }

  getProductDetails(id: number): void {
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
        this.relatedProducts = res.slice(0, 9) ;
      },
      error: (err) => console.log(err),
    });
  }

}
