// src/app/features/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { OrderDto, UpdateUserDto, UserDto } from '../../core/interfaces/http';
import { ProfileService } from '../../core/service/profile.service';
import { AuthService } from '../../core/service/auth.service';
import { OrderService } from '../../core/service/order.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  orderHistory: OrderDto[] = [];


  private customerId!: number;
  private rawProfile!: UserDto & { address: string; /* إذا ضفت حقول إضافية لاحقاً */ };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private orderService : OrderService ,
    private authService: AuthService
  ) {}

  ngOnInit(): void {


    this.initForm();
    this.loadCustomerId()
    this.loadOrderHistory()

    // 3) جلب البيانات من السيرفر وملء الـ Form
    this.loadProfile();
  }
  private loadCustomerId(): void {
    const id = this.authService.getCustomerId();
    if (id !== null) {
      this.customerId = id;
    } else {
      console.warn('لم يُعثر على customerId صالح في التوكن');
      // يمكن إعادة التوجيه لصفحة تسجيل الدخول هنا إذا أردت
    }
  }
  private initForm(): void {
    this.profileForm = this.fb.group({
      // المعلومات الشخصية
      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      // (إذا تبغى تغير كلمة المرور بنفس الواجهة)
      passwordInfo: this.fb.group({
        currentPassword: [''],
        newPassword: ['']
      }),
      // دفتر العناوين (FormArray)
      addresses: this.fb.array([])
    });
  }

  // سهولة الوصول للقسم الشخصي
  get personalInfo() {
    return this.profileForm.get('personalInfo') as FormGroup;
  }
  // سهولة الوصول للـ FormArray
  get addresses(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  private loadProfile(): void {
    this.profileService
      .getProfileByCustomerId(this.customerId)
      .subscribe((user) => {
        // خزن الـ raw data للاستخدام عند التحديث
        this.rawProfile = user as any;

        // 1) قسّم الاسم الكامل إلى أول و آخر
        const [firstName, ...lastNameParts] = user.name.split(' ');
        this.personalInfo.patchValue({
          firstName,
          lastName: lastNameParts.join(' '),
          email: user.email
        });

        // 2) عاّد بناء الـ addresses حسب القيمة الواردة
        this.addresses.clear();
        this.addresses.push(
          this.fb.group({
            address: [ (user as any).address || '', Validators.required ]
          })
        );
      });
  }

  // لإضافة عنوان جديد يدوياً
  addAddress(): void {
    this.addresses.push(
      this.fb.group({ address: ['', Validators.required] })
    );
  }

  // حذف عنوان
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  saveProfileChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    // جهّز الـ DTO بما يتوافق مع ما يتوقعه الـ API
    const p = this.profileForm.value;
    const update: UpdateUserDto = {
      id: this.rawProfile.id,
      name: `${p.personalInfo.firstName} ${p.personalInfo.lastName}`,
      email: p.personalInfo.email,
      isActive: this.rawProfile.isActive,
      creationDate: new Date().toISOString(),
      password: p.passwordInfo.newPassword || '', // إذا لم يغيّر، يمكنك تركها ''
      roleId: 0 ,
      phone: " ",
      address: this.addresses.at(0)?.value.address,
      customerStatusId: 0
    };

    this.profileService
      .updateProfile(this.customerId, update)
      .subscribe({
        next: () => alert('تم تحديث الملف الشخصي بنجاح'),
        error: (err) => {
          console.error(err);
          alert('حدث خطأ أثناء التحديث');
        }
      });
  }
  private loadOrderHistory(): void {
    this.orderService.getOrdersByCustomerId(this.customerId).subscribe({
      next: orders => {
        this.orderHistory = orders;
      },
      error: err => {
        console.error('Error loading order history', err);
      }
    });
  }
}
