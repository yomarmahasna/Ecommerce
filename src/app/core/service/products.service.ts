import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private _httpClient: HttpClient) {}
  allProducts(): Observable<any> {
    return this._httpClient.get(`https://fakestoreapi.in/api/products`);
  }

  getDetails(id: string): Observable<any> {
    return this._httpClient.get(`https://fakestoreapi.in/api/products/${id}`);
  }
}
