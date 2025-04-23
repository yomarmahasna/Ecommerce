import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AdminNavbarComponent } from "../admin-navbar/admin-navbar.component";


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavbarComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  ];

  roles = ['Admin', 'User'];
  createForm!: FormGroup;
  roleForm!: FormGroup;
  passwordForm!: FormGroup;

  selectedUser: User | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required]
    });

    this.roleForm = this.fb.group({
      role: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createUser() {
    const newUser: User = {
      id: this.users.length + 1,
      ...this.createForm.value
    };
    this.users.push(newUser);
    this.createForm.reset({ role: 'User' });
  }

  selectUser(user: User) {
    this.selectedUser = { ...user };
    this.roleForm.patchValue({ role: user.role });
    this.passwordForm.reset();
  }

  changeUserRole() {
    if (!this.selectedUser) return;
    const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) this.users[index].role = this.roleForm.value.role;
  }

  changePassword() {
    if (this.selectedUser) {
      console.log(`Changed password for ${this.selectedUser.name}: ${this.passwordForm.value.password}`);
      this.passwordForm.reset();
    }
  }
}
