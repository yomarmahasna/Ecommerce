// wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {MyProduct } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistCount: BehaviorSubject<number> = new BehaviorSubject(
    (JSON.parse(localStorage.getItem('wishlistState') ?? '[]') as MyProduct[]).length
  );


  addToWishlist(product: MyProduct): void {
    const storedWishlist = localStorage.getItem('wishlistState');
    const wishlist: MyProduct[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    if (!wishlist.some(item => item.id === product.id)) {
      product.isAddedToWishlist = true;
      wishlist.push(product);
      localStorage.setItem('wishlistState', JSON.stringify(wishlist));
      this.wishlistCount.next(wishlist.length);
    }
  }

  removeFromWishlist(product: MyProduct): void {
    const storedWishlist = localStorage.getItem('wishlistState');
    let wishlist: MyProduct[] = storedWishlist ? JSON.parse(storedWishlist) : [];
    wishlist = wishlist.filter(item => item.id !== product.id);
    localStorage.setItem('wishlistState', JSON.stringify(wishlist));
    this.wishlistCount.next(wishlist.length);
  }

  getWishlist(): MyProduct[] {
    const storedWishlist = localStorage.getItem('wishlistState');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }
}
