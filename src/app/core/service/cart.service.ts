import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProducts } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _httpClient: HttpClient,
  ) {}
  countOfCart: BehaviorSubject<number> = new BehaviorSubject(
    (
      JSON.parse(localStorage.getItem('cartState') ?? '[]') as IProducts[]
    ).length
  );

  addToCart(product: IProducts) {
    const storedCart = localStorage.getItem('cartState');
    const cart: IProducts[] = storedCart ? JSON.parse(storedCart) : [];

    if (!product.isAddedToCart) {
      product.isAddedToCart = true;
      cart.push(product);
      localStorage.setItem('cartState', JSON.stringify(cart));
      this.countOfCart.next(cart.length);
    } 
  }

  isAddedToCart(product: IProducts): boolean {
    const storedCart = localStorage.getItem('cartState');
    const cartState = storedCart ? JSON.parse(storedCart) : [];
    const isAdded = cartState.some((item: IProducts) => item.id === product.id);
    return isAdded;
  }
}
