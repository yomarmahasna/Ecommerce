import { AuthService } from './../../../core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RegisterDto } from '../../../core/interfaces/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  strengthMessage: string = '';
  strengthClass: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agree: [false, Validators.requiredTrue],
    });
  }

  checkStrength(): void {
    const value = this.signupForm.get('password')?.value;
    if (value.length < 6) {
      this.strengthMessage = 'Password strength: weak';
      this.strengthClass = 'weak';
    } else if (/[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && value.length >= 8) {
      this.strengthMessage = 'Password strength: strong';
      this.strengthClass = 'strong';
    } else {
      this.strengthMessage = 'Password strength: medium';
      this.strengthClass = 'medium';
    }
  }

  onSignup(): void {
    if (this.signupForm.invalid) return console.log("ojnvipjvbisvdvib");

    const { firstName, lastName, email, phone, password } = this.signupForm.value;

    const payload: RegisterDto = {
      id:               0,
      name:             `${firstName} ${lastName}`,
      isActive:         true,
      creationDate:     new Date().toISOString(),
      email,
      password,
      roleId:           0,
      phone,
      address:          '',
      customerStatusId: 0
    };

    this.authService.register(payload).subscribe({
      next: (msg: string) =>

      this.router.navigate(['/auth/login']),

      error: err =>
        alert('An error occurred: ' + (err.error?.message || err.message))
    });
  }
}
