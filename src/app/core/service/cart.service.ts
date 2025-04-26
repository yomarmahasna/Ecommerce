import { MyProduct } from './../interfaces/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _httpClient: HttpClient,
  ) {}
  countOfCart: BehaviorSubject<number> = new BehaviorSubject(
    (
      JSON.parse(localStorage.getItem('cartState') ?? '[]') as MyProduct[]
    ).length
  );

  addToCart(product: MyProduct) {
    const storedCart = localStorage.getItem('cartState');
    const cart: MyProduct[] = storedCart ? JSON.parse(storedCart) : [];

    if (!product.isAddedToCart) {
      product.isAddedToCart = true;
      cart.push(product);
      localStorage.setItem('cartState', JSON.stringify(cart));
      this.countOfCart.next(cart.length);
    }
  }

  isAddedToCart(product: MyProduct): boolean {
    const storedCart = localStorage.getItem('cartState');
    const cartState = storedCart ? JSON.parse(storedCart) : [];
    const isAdded = cartState.some((item: MyProduct) => item.id === product.id);
    return isAdded;
  }
}
