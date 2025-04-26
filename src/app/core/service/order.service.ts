import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetailDto, OrderDto } from '../interfaces/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://localhost:44378/api/Order';

  constructor(private http: HttpClient) {}

  // 1) تنشئ الطلب، ونُعلم Angular أن الردّ نص (وليس JSON)
  createOrder(dto: OrderDto): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/CreateOrder`,
      dto,
      { responseType: 'text' }  // <-- هنا
    );
  }

  // 2)  دالة لجلب الطلب حسب رقم الطلب
  getOrderByOrderNumber(orderNumber: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(
      `${this.baseUrl}/GetOrderByOrderNumber/${orderNumber}`
    );
  }

  // 3) دوال تفاصيل الطلب تبقى كما هي
  createOrderDetail(dto: OrderDetailDto): Observable<void> {
    return this.http.post<void>(
      'https://localhost:44378/api/OrderDetail/CreateOrderDetail',
      dto,
      { responseType: 'text' as 'json' }
    );
  }

  getOrdersByCustomerId(customerId: number): Observable<OrderDto[]> {
    const url = `${this.baseUrl}/GetOrdersByCustomerId/${customerId}`;
    return this.http.get<OrderDto[]>(url);
  }
}
