import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../core/interfaces/http';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminNavbarComponent],
  templateUrl: './order-management.component.html'
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  orderForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.orders = [
      {
        id: 1,
        orderNumber: 'ORD-1001',
        customerName: 'Jane Smith',
        customerPhone: '+962 7 1234 5678',
        orderDate: '2025-04-17',
        deliveryDate: '2025-04-20',
        status: 'New',
        shippingAddress: 'Amman – Queen Rania Street – Building No.21',
        customerNotes: '',
        feedback: '',
        items: [
          { productName: 'Smartphone XYZ', unitPrice: 499, quantity: 1, netPrice: 499 },
          { productName: 'Earbuds ABC', unitPrice: 50, quantity: 1, netPrice: 50 }
        ]
      }
    ];

    this.initOrderForm();
  }

  initOrderForm() {
    this.orderForm = this.fb.group({
      status: [''],
      deliveryDate: [''],
      customerNotes: ['']
    });
  }

  openOrderModal(order: Order) {
    this.selectedOrder = order;
    this.orderForm.patchValue({
      status: order.status,
      deliveryDate: order.deliveryDate,
      customerNotes: order.customerNotes || ''
    });
  }

  updateOrderStatus() {
    if (this.selectedOrder) {
      const index = this.orders.findIndex(o => o.id === this.selectedOrder!.id);
      if (index !== -1) {
        this.orders[index] = {
          ...this.selectedOrder,
          ...this.orderForm.value
        };
      }
    }
  }

  confirmOrder() {
    if (this.selectedOrder) {
      this.orderForm.patchValue({ status: 'Confirmed' });
      this.updateOrderStatus();
    }
  }

  cancelOrder() {
    if (this.selectedOrder) {
      this.orderForm.patchValue({ status: 'Cancelled' });
      this.updateOrderStatus();
    }
  }

  removeItem(index: number) {
    if (this.selectedOrder) {
      this.selectedOrder.items.splice(index, 1);
    }
  }

  getTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.netPrice, 0);
  }
}
