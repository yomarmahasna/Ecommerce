import { Injectable } from '@angular/core';
import { ProductReview } from '../interfaces/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductReviewService {
  private baseUrl = 'https://localhost:44378/api/ProductReview';
  constructor(private http: HttpClient) { }

  getReviewByProductId(id: number): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.baseUrl}/GetReviewsByProductId/${id}`);
  }

  create(review:ProductReview ): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateProductReview`, review);
  }
}
