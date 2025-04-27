// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User,
  CreateUserDto,
  ChangePasswordDto,
  AssignRoleDto
} from '../interfaces/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:44378/api/User';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/GetAllUsers`);
  }

  registerUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/RegisterUser`, dto);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/GetUserById/${id}`);
  }
  changePassword(dto: ChangePasswordDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/ChangePassword`, dto);
  }

  assignRole(dto: AssignRoleDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/AssignRole`, dto);
  }

  banUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/BanUser/${userId}`, null);
  }

  activateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/ActivateUser/${userId}`, null);
  }

}
