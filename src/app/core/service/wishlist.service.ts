// wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProducts } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistCount: BehaviorSubject<number> = new BehaviorSubject(
    (JSON.parse(localStorage.getItem('wishlistState') ?? '[]') as IProducts[]).length
  );


  addToWishlist(product: IProducts): void {
    const storedWishlist = localStorage.getItem('wishlistState');
    const wishlist: IProducts[] = storedWishlist ? JSON.parse(storedWishlist) : [];

    if (!wishlist.some(item => item.id === product.id)) {
      product.isAddedToWishlist = true;
      wishlist.push(product);
      localStorage.setItem('wishlistState', JSON.stringify(wishlist));
      this.wishlistCount.next(wishlist.length);
    }
  }

  removeFromWishlist(product: IProducts): void {
    const storedWishlist = localStorage.getItem('wishlistState');
    let wishlist: IProducts[] = storedWishlist ? JSON.parse(storedWishlist) : [];
    wishlist = wishlist.filter(item => item.id !== product.id);
    localStorage.setItem('wishlistState', JSON.stringify(wishlist));
    this.wishlistCount.next(wishlist.length);
  }

  getWishlist(): IProducts[] {
    const storedWishlist = localStorage.getItem('wishlistState');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }
}
