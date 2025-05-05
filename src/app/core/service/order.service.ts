import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderDetailDto, OrderDto, OrderManagment, User } from '../interfaces/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://localhost:44378/api/Order';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderManagment[]> {
    return this.http.get<OrderManagment[]>(`${this.baseUrl}/GetAllOrders`);
  }

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
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/GetUserById/${id}`);
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

  updateOrder(id: number, order: OrderManagment): Observable<OrderManagment> {
    return this.http.put<OrderManagment>(
      `${this.baseUrl}/UpdateOrder/${id}`,
      order
    );
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/CancelOrder/${id}`,
      null
    );
  }

  confirmOrder(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/ConfirmOrder/${id}`,
      null
    );
  }

  deliverOrder(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/DeliverOrder/${id}`,
      null
    );
  }

  getOrderDetails(orderId: number): Observable<OrderDetailDto[]> {
    return this.http.get<OrderDetailDto[]>(
      `https://localhost:44378/api/OrderDetail/GetOrderDetailByOrderId/${orderId}`
    );
  }

}
