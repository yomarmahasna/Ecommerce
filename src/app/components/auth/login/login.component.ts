import { AuthService } from './../../../core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginDto, LoginResponse } from '../../../core/interfaces/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    const { email,password } = this.loginForm.value;
    const payload: LoginDto = {
      email,
      password,
    }

    this.authService.login(payload).subscribe({
      next: (jwt: string) => {
        // 1. احفظ التوكن
        localStorage.setItem('token', jwt);

        // 2. اعرف دور المستخدم
        const role = this.authService.getUserRole();

        // 3. وجهه حسب الدور
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'Customer') {
          this.router.navigate(['/customer/home']);
        } else {
          // حالة غير متوقعة
          console.warn('Unknown role:', role);
          this.router.navigate(['/login']);
        }
      },
      error: (e) => {
        alert('Login failed: ' + e);
      }
    });
  }
  }

