import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { IProducts } from '../../core/interfaces/http';
import { CartService } from '../../core/service/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  shippingForm!: FormGroup;
  cartItems: IProducts[] = [];
  orderTotal: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.initForm();
  }

  // قراءة عناصر السلة من localStorage
  loadCartItems(): void {
    const storedCart: IProducts[] = JSON.parse(localStorage.getItem('cartState') || '[]');
    this.cartItems = storedCart;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.orderTotal = this.cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }

  initForm(): void {
    this.shippingForm = this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      building: ['', Validators.required]
    });
  }

  placeOrder(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    // هنا يمكنك إرسال بيانات الطلب إلى API لمعالجة الطلب وإرسال البريد الإلكتروني
    // مثال توضيحي:
    const orderDetails = {
      items: this.cartItems,
      shippingAddress: this.shippingForm.value,
      total: this.orderTotal,
      orderNumber: Math.floor(Math.random() * 1000000)
    };

    // عرض تنبيه بنجاح العملية
    alert(`Order placed successfully!\nOrder Number: ${orderDetails.orderNumber}\nAn email with order details has been sent to you.`);

    // بعد الطلب يمكن تفريغ السلة:
    localStorage.removeItem('cartState');
    this.cartService.countOfCart.next(0);

    // إعادة التوجيه إلى الصفحة الرئيسية أو صفحة تأكيد الطلب
    this.router.navigate(['/']);
  }

  returnToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }
}
