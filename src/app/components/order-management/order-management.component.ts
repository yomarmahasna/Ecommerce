// src/app/admin/order-management/order-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { Order, OrderDetailDto, OrderManagment } from '../../core/interfaces/http';
import { OrderService } from '../../core/service/order.service';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './order-management.component.html'
})
export class OrderManagementComponent implements OnInit {
  orders: OrderManagment[] = [];
  selectedOrder: OrderManagment | null = null;
  orderForm!: FormGroup;
  statuses = [
    { id: 1, label: 'New',   badgeClass: 'bg-secondary' },
    { id: 2, label: 'Confirmed', badgeClass: 'bg-info' },
    { id: 3, label: 'Cancelled', badgeClass: 'bg-danger' },
    { id: 4, label: 'Delivered', badgeClass: 'bg-success' }
  ];

    // الدالة التي تعيد تصنيف الحالة (label)
    getStatusLabel(id: number): string {
      const s = this.statuses.find(st => st.id === id);
      return s ? s.label : 'New';
    }

    // الدالة التي تعيد كلاس البادج حسب الحالة
    getBadgeClass(id: number): string {
      const s = this.statuses.find(st => st.id === id);
      return s ? s.badgeClass : 'bg-secondary';
    }
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private userService :UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOrders();
  }

  private initForm() {
    this.orderForm = this.fb.group({
      deliveryDate: [''],
      orderStatusId: ['']
    });
  }

  private loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        this.orders = data;
        // لكل طلب، جلب بيانات الزبون
        this.orders.forEach(o => {
          this.userService.getUserById(o.customerId).subscribe(u => {
            o.customerName  = u.name;
            o.customerPhone = u.phone;
            // إذا كان API يعيد تاريخ الطلب:
            o.orderDate     =  o.deliveryDate;
          });
        });
      },
      error: err => console.error('Load orders failed', err)
    });
  }

  getTotal(order: OrderManagment): number {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => sum + item.netPrice, 0);
  }

  getOrederTotal(order: OrderManagment): number {
    if (!order.items) return order.totalPrice;
    return order.items.reduce((sum, item) => sum + item.netPrice, 0);
  }
  openOrderModal(order: OrderManagment) {
    this.orderForm.patchValue({
      deliveryDate: order.deliveryDate,
      orderStatusId: order.orderStatusId
    });

    this.orderService.getOrderDetails(order.id).subscribe({
      next: details => {
        const detailsArray = Array.isArray(details) ? details : [details];  // ✨ هذا هو الحل السريع

        this.selectedOrder = {
          ...order,
          items: detailsArray
        };
      },
      error: err => console.error('Load order details failed', err)
    });

  }
  saveOrder() {
    if (!this.selectedOrder) return;

    // دمج القيم الجديدة من الـ form في نسخة من selectedOrder
    const updatedOrder: OrderManagment = {
      ...this.selectedOrder,
      orderStatusId: this.orderForm.value.orderStatusId,
      deliveryDate:    this.orderForm.value.deliveryDate
    };

    // استدعاء الـ endpoint مع المعرّف والكائن الكامل
    this.orderService
      .updateOrder(updatedOrder.id, updatedOrder)
      .subscribe({
        next: (orderFromServer) => {
          // حدّث العنصر في هذه المصفوفة لتعكس التغيير فوراً في الـ UI
          const idx = this.orders.findIndex(o => o.id === orderFromServer.id);
          if (idx > -1) {
            this.orders[idx] = orderFromServer;
          }
        },
        error: err => console.error('Update failed', err)
      });
  }
  cancelOrder() {
    if (!this.selectedOrder) return;
    this.orderService.cancelOrder(this.selectedOrder.id).subscribe({
      next: () => {
        this.selectedOrder!.status = 'Cancelled';
        this.selectedOrder!.orderStatusId = 3; // مثال
      },
      error: err => console.error('Cancel failed', err)
    });
  }

  confirmOrder() {
    if (!this.selectedOrder) return;
    this.orderService.confirmOrder(this.selectedOrder.id).subscribe({
      next: () => {
        this.selectedOrder!.status = 'Confirmed';
        this.selectedOrder!.orderStatusId = 2; // مثال
      },
      error: err => console.error('Confirm failed', err)
    });
  }

  deliverOrder() {
    if (!this.selectedOrder) return;
    this.orderService.deliverOrder(this.selectedOrder.id).subscribe({
      next: () => {
        this.selectedOrder!.status = 'Delivered';
        this.selectedOrder!.orderStatusId = 4; // مثال
      },
      error: err => console.error('Deliver failed', err)
    });
  }

  removeItem(index: number) {
    if (this.selectedOrder && this.selectedOrder.items) {
      this.selectedOrder.items.splice(index, 1);
    }
  }

}
