import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto, LoginResponse, RegisterDto } from '../interfaces/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
