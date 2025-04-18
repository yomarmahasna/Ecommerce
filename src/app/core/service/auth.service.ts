import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _httpClient: HttpClient) {}
    baseUrl = 'https://e-commerce-serverside.vercel.app';
  register(registerData: any): Observable<any> {
    return this._httpClient.post(`https://e-commerce-serverside.vercel.app/api/users`, registerData);
  }

  login(loginUser: any): Observable<any> {
    return this._httpClient.post(`https://e-commerce-serverside.vercel.app/api/users/auth`, loginUser);
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
