import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto, LoginResponse, RegisterDto } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(private _httpClient: HttpClient) {}
    baseUrl = 'https://localhost:44378/api/User';
    register(dto: RegisterDto) {
      return this._httpClient.post(`${this.baseUrl}/RegisterUser`, dto , { responseType: 'text' });
    }

    login(dto: LoginDto): Observable<string> {
      return this._httpClient.post(`${this.baseUrl}/Login`, dto,{ responseType: 'text' });
    }
  authorized(): boolean {
    if (localStorage.getItem('token') != null) {
      return true;
    } else return false;
  }

  logout(): Observable<any> {
    return this._httpClient.post(`https://e-commerce-serverside.vercel.app/api/users/logout`, {});
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * يفك تشفير جزء الـ payload من JWT
   * ويعيده ككائن JSON
   */
  private decodePayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // نحصل على الجزء الأوسط من التوكن (payload)
      const payloadBase64 = token.split('.')[1];
      // نحول من Base64 إلى نص
      const payloadJson   = atob(payloadBase64);
      // نعيد النص ككائن JSON
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  /**
   * يستخرج الـ customerId (هنا PersonId) من الـ payload
   * بناءً على الحقل PersonId الموجود في التوكن
   */
  getCustomerId(): number | null {
    const payload = this.decodePayload();
    if (!payload) return null;

    // إذا كان الحقل باسم PersonId
    if (payload.PersonId) {
      // نحوله من نص إلى رقم
      return parseInt(payload.PersonId, 10);
    }

    // عدم وجود الحقل يعيد null
    return null;
  }

  /**
   * يتحقّق مما إذا كان التوكن منتهي الصلاحية
   * بالاعتماد على حقل exp في الـ payload
   */
  isTokenExpired(): boolean {
    const payload = this.decodePayload();
    if (!payload || !payload.exp) return true;

    // الوقت الحالي بوحدة الثواني منذ Epoch
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
