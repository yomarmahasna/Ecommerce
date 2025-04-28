import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { User } from '../../core/interfaces/http';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './customer-management.component.html'
})
export class CustomerManagementComponent implements OnInit {
  customers: User[] = [];
  selectedCustomer: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.userService.getAllUsers().subscribe({
      next: users => {
        // فلترة لإظهار الزبائن فقط
        this.customers = users.filter(u => u.roleId === 0);
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  openCustomerModal(c: User) {
    this.selectedCustomer = { ...c };
  }

  banCustomer() {
    if (!this.selectedCustomer) return;
    this.userService.banUser(this.selectedCustomer.id).subscribe({
      next: () => {
        this.selectedCustomer!.isActive = false;
        const i = this.customers.findIndex(u => u.id === this.selectedCustomer!.id);
        if (i > -1) this.customers[i].isActive = false;
      },
      error: err => console.error('Ban failed', err)
    });
  }

  activateCustomer() {
    if (!this.selectedCustomer) return;
    this.userService.activateUser(this.selectedCustomer.id).subscribe({
      next: () => {
        this.selectedCustomer!.isActive = true;
        const i = this.customers.findIndex(u => u.id === this.selectedCustomer!.id);
        if (i > -1) this.customers[i].isActive = true;
      },
      error: err => console.error('Activate failed', err)
    });
  }
}
