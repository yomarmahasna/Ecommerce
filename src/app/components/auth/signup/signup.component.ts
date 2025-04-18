import { AuthService } from './../../../core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private authService: AuthService) {}

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
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: () => alert('Verification email sent! Please check your inbox to activate your account.'),
        error: (error) => alert('An error occurred: ' + error.message),
      });
    }
  }
}
