import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  orderHistory = [
    { orderNumber: '#1001', date: '2025-04-05', total: 120.00 },
    { orderNumber: '#1002', date: '2025-03-20', total: 250.00 }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    // إنشاء نموذج واحد يحتوي على الأقسام الرئيسية
    this.profileForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      passwordInfo: this.fb.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required]
      }),
      addresses: this.fb.array([
        this.fb.group({ address: ['Amman, Queen Rania Street, Building 21', Validators.required] })
      ])
    });
  }

  // Getters للتسهيل
  get personalInfo() {
    return this.profileForm.get('personalInfo') as FormGroup;
  }

  get passwordInfo() {
    return this.profileForm.get('passwordInfo') as FormGroup;
  }

  get addresses(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  // إضافة عنوان جديد
  addAddress(): void {
    this.addresses.push(this.fb.group({ address: ['', Validators.required] }));
  }

  // إزالة عنوان من دفتر العناوين
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  // حفظ التغييرات (يمكن استبداله بنداء API)
  saveProfileChanges(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      alert('Profile changes saved.');
    } else {
      alert('Please fill all required fields.');
    }
  }
}

