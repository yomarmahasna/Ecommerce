import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import {
  User,
  CreateUserDto,
  AssignRoleDto,
  ChangePasswordDto
} from '../../core/interfaces/http';
import { UserService } from '../../core/service/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  roles = [
    { id: 1, name: 'Admin' },
    { id: 0, name: 'Customer' }
  ];

  createForm!: FormGroup;
  roleForm!: FormGroup;
  passwordForm!: FormGroup;
  selectedUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUsers();
  }

  private initForms() {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [0, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.roleForm = this.fb.group({ role: [0, Validators.required] });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: users => (this.users = users),
      error: err => console.error(err)
    });
  }

  // <-- هذه الميثود لتحويل رقم الـ role إلى اسمه
  getRoleName(roleId: number): string {
    const r = this.roles.find(x => x.id === roleId);
    return r ? r.name : '—';
  }

  createUser() {
    if (this.createForm.invalid) return;

    const f = this.createForm.value;
    const dto: CreateUserDto = {
      id: 0,
      name: f.name,
      isActive: true,
      creationDate: new Date().toISOString(),
      email: f.email,
      password: f.password,
      roleId: 1,
      phone: "077777777777",
      address: " ",
      customerStatusId: f.customerStatusId
    };
    console.log(f.roleId);
    this.userService.registerUser(dto).subscribe({
      next: user => {
        this.users.push(user);
        this.createForm.reset({
          roleId: 0,
          customerStatusId: 0,
          phone: '',
          address: ''
        });
      },
      error: err => console.error('Create failed', err)
    });
  }
  selectUser(user: User) {
    this.selectedUser = { ...user };
    this.roleForm.patchValue({ role: user.roleId });
    this.passwordForm.reset();
  }

  changeUserRole() {
    if (!this.selectedUser) return;
    const dto: AssignRoleDto = {
      userId: this.selectedUser.id,
      roleId: this.roleForm.value.role
    };
    this.userService.assignRole(dto).subscribe({
      next: () => {
        const i = this.users.findIndex(u => u.id === dto.userId);
        if (i > -1) this.users[i].roleId = dto.roleId;
      },
      error: err => console.error(err)
    });
  }

  changePassword() {
    if (!this.selectedUser) return;
    const dto: ChangePasswordDto = {
      userId: this.selectedUser.id,
      newPasswordHash: this.passwordForm.value.password
    };
    this.userService.changePassword(dto).subscribe({
      next: () => this.passwordForm.reset(),
      error: err => console.error(err)
    });
  }
}
