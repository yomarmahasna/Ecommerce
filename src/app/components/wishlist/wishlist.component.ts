import { CartService } from './../../core/service/cart.service';
import { WishlistService } from './../../core/service/wishlist.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { IProducts } from '../../core/interfaces/http';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    const storedWishlist: IProducts[] = JSON.parse(localStorage.getItem('wishlistState') || '[]');
    const data = localStorage.getItem('wishlistState');
    console.log("Wishlist data from localStorage:", data);

    // تأكيد وجود خاصية الكمية لكل منتج
    storedWishlist.forEach(item => {
      if (!item.quantity) {
        item.quantity = 1;
      }
    });
    this.wishlistForm = this.fb.group({
      items: this.fb.array(storedWishlist.map(item => this.createWishlistItem(item)))
    });
  }

  createWishlistItem(item: IProducts): FormGroup {
    return this.fb.group({
      id: [item.id],
      title: [item.title],
      price: [item.price],
      image: [item.image],
      quantity: [item.quantity, [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.wishlistForm.get('items') as FormArray;
  }

  updateQuantity(index: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);
    if (newQuantity < 1) return;
    this.items.at(index).get('quantity')?.setValue(newQuantity);
    this.saveWishlist();
  }

  removeItem(index: number): void {
    const itemGroup = this.items.at(index);
    const product: IProducts = itemGroup.value;
    this.items.removeAt(index);
    this.saveWishlist();
    this.wishlistService.wishlistCount.next(this.items.length);
    this.wishlistService.removeFromWishlist(product);
  }

  moveToCart(index: number): void {
    const itemGroup = this.items.at(index);
    const product: IProducts = itemGroup.value;
    this.wishlistService.removeFromWishlist(product);
    this.cartService.addToCart(product);
    this.items.removeAt(index);
    this.saveWishlist();
  }

  saveWishlist(): void {
    const wishlistItems = this.items.value;
    localStorage.setItem('wishlistState', JSON.stringify(wishlistItems));
  }


  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
