import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductDto } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private base = 'https://localhost:44378/api/Product';
  constructor(private _httpClient: HttpClient) {}
  allProducts(): Observable<any> {
    return this._httpClient.get(`https://localhost:44378/api/Product/GetAllProduct`);
  }

  getDetails(id: number): Observable<any> {
    return this._httpClient.get(`https://localhost:44378/api/Product/GetProductById/${id}`);
  }

  getById(id: number): Observable<Product> {
    return this._httpClient.get<Product>(`${this.base}/GetProductById/${id}`);
  }

  create(dto: ProductDto): Observable<Product> {
    return this._httpClient.post<Product>(`${this.base}/CreateProduct`, dto);
  }

  update(id: number, dto: ProductDto): Observable<Product> {
    return this._httpClient.put<Product>(
      `${this.base}/UpdateProduct/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.base}/DeleteProduct/${id}`);
  }

  getByCategory(categoryId: number): Observable<Product[]> {
    return this._httpClient.get<Product[]>(
      `${this.base}/GetProductsByCategoryId/${categoryId}`);
  }

  getByBrand(brandId: number): Observable<Product[]> {
    return this._httpClient.get<Product[]>(
      `${this.base}/GetProductsByBrandId/${brandId}`);
  }

  setAvailability(productId: number,
                  statusId: number): Observable<void> {
    return this._httpClient.put<void>(
      `${this.base}/UpdateAvailabilityStatus/${productId}/${statusId}`, null);
  }

  calculateTax(productId: number): Observable<number> {
    return this._httpClient.get<number>(
      `${this.base}/CalculateProductTax/${productId}`);
  }
}
