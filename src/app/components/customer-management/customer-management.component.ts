import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Customer } from '../../core/interfaces/http';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './customer-management.component.html'
})
export class CustomerManagementComponent {
  customers: Customer[] = [
    {
      id: 1,
      name: 'Ahmad Ali',
      phone: '+962 7 9876 5432',
      email: 'ahmad@example.com',
      lastOrderDate: '2025-04-15',
      lastLoginDate: '2025-04-17',
      addresses: [
        'Amman – Queen Rania Street – Building No.21',
        'Zarqa – Al-Zahra District – Building 12'
      ],
      orders: [
        {
          orderNumber: 'ORD-1005',
          orderDate: '2025-04-10',
          totalPrice: 120.0,
          status: 'Delivered',
          deliveryDate: '2025-04-12'
        },
        {
          orderNumber: 'ORD-1020',
          orderDate: '2025-04-15',
          totalPrice: 75.0,
          status: 'New',
          deliveryDate: '2025-04-18'
        }
      ]
    }
  ];

  selectedCustomer: Customer | null = null;

  openCustomerModal(customer: Customer) {
    this.selectedCustomer = customer;
  }

  banCustomer() {
    console.log(`Banned: ${this.selectedCustomer?.name}`);
  }

  activateCustomer() {
    console.log(`Activated: ${this.selectedCustomer?.name}`);
  }
}
