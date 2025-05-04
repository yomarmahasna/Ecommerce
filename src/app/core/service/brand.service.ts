import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand, CreateBrandDto, UpdateBrandDto } from '../interfaces/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly baseUrl = 'https://localhost:44378/api/Brand';

  constructor(private http: HttpClient) {}

  /** جلب كل الماركات */
  getAllBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/GetAllBrand`);
  }

  /** جلب ماركة واحدة بالـ id */
  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.baseUrl}/GetBrandById/${id}`);
  }

  /** إنشاء ماركة جديدة */
  createBrand(dto: CreateBrandDto): Observable<Brand> {
    return this.http.post<Brand>(`${this.baseUrl}/Create`, dto,
      { responseType: 'text' as 'json' });
  }

  /** تحديث ماركة موجودة */
  updateBrand(id: number, dto: UpdateBrandDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/UpdateBrand/${id}`, dto);
  }

  /** حذف ماركة */
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/DeleteBrand/${id}`);
  }

  /** جلب الماركات المفعّلة فقط */
  getActiveBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/GetActiveBrands`);
  }

  /** تفعيل ماركة */
  activateBrand(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/ActivateBrand/${id}`, {});
  }

  /** إلغاء تفعيل ماركة */
  deactivateBrand(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/DeactivateBrand/${id}`, {});
  }
  getByCategory(categoryId: number): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/GetBrandByCategory/${categoryId}`);
  }
}


