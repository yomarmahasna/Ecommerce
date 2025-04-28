import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, CategoryDto } from '../interfaces/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'https://localhost:44378/api/Category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/GetAllCategory`);
  }
  getCategoryById(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.baseUrl}/GetCategoryById/${id}`);
  }
  create(dto: CategoryDto): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/CreateCategory`, dto);
  }

  update(id: number, dto: CategoryDto): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/UpdateCategory/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteCategory/${id}`);
  }

  activate(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/ActivateCategory/${id}`, null);
  }

  deactivate(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/DeactivateCategory/${id}`, null);
  }
}
