import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto, LoginResponse, RegisterDto } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private tokenKey = 'token';


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
/** يقرأ الـ JWT من localStorage ويعيده */
getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}

/** يفك تشفير الـ payload من JWT ويعيده كـ JSON */
private decodePayload(): any | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

/** يقرأ حقل الـ role من الـ payload */
getUserRole(): string | null {
  return this.decodePayload()?.role ?? null;
}

/** يتحقق من وجود التوكن وصلاحيته بناءً على الـ exp */
isLoggedIn(): boolean {
  const payload = this.decodePayload();
  if (!payload?.exp) return false;
  return Math.floor(Date.now() / 1000) < payload.exp;
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
