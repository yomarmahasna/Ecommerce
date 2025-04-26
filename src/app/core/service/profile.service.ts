import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserDto, UserDto } from '../interfaces/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private _httpClient: HttpClient) { }

  getProfileByCustomerId(id: number): Observable<UserDto> {
    return this._httpClient.get<UserDto>(`https://localhost:44378/api/User/GetUserById/${id}`);
  }


  updateProfile(id: number, data: UpdateUserDto): Observable<void> {
    return this._httpClient.put<void>(`https://localhost:44378/api/User/UpdateUser/${id}`, data);
  }

}
