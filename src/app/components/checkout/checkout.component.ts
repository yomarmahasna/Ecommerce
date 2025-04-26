import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MyProduct, OrderDetailDto, OrderDto } from '../../core/interfaces/http';
import { CartService } from '../../core/service/cart.service';
import { OrderService } from '../../core/service/order.service';
import { forkJoin, switchMap } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  shippingForm!: FormGroup;
  cartItems: MyProduct[] = [];
  orderTotal: number = 0;
  customerId!: number;


  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.initForm();
    this.loadCustomerId();

  }

  // قراءة عناصر السلة من localStorage
  loadCartItems(): void {
    const storedCart: MyProduct[] = JSON.parse(localStorage.getItem('cartState') || '[]');
    this.cartItems = storedCart;
    this.calculateTotal();
  }
  /** جلب الـ customerId من التوكن عبر AuthService */
  private loadCustomerId(): void {
    const id = this.authService.getCustomerId();
    if (id !== null) {
      this.customerId = id;
    } else {
      console.warn('لم يُعثر على customerId صالح في التوكن');
      // يمكن إعادة التوجيه لصفحة تسجيل الدخول هنا إذا أردت
    }
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

    const orderNumber = Math.floor(Math.random() * 1_000_000).toString();
    const header: OrderDto = {
      id: 0,
      name: `Order ${orderNumber}`,
      orderNumber,
      deliveryDate: new Date().toISOString(),
      totalPrice: this.orderTotal,
      orderStatusId: 1,
      shippingCity: this.shippingForm.value.city,
      shippingStreet: this.shippingForm.value.street,
      shippingBuildingNumber: this.shippingForm.value.building,
      customerId: this.customerId,
      rating: 0,
      feedback: ' '
    };

    this.orderService.createOrder(header).pipe(
      // 1) بعد نجاح CreateOrder (201 + نص)، ندعو GetOrderByOrderNumber
      switchMap(() => this.orderService.getOrderByOrderNumber(orderNumber)),
      switchMap(createdOrder => {
        const orderId = createdOrder.id;
        const detailDTOs: OrderDetailDto[] = this.cartItems.map(item => ({
          name: item.name,
          isActive: true,
          creationDate: new Date().toISOString().slice(0, -1),
          orderId,
          productId: item.id,
          unitPrice: item.price,
          quantity: item.quantity || 1,
          netPrice: item.price * (item.quantity || 1)
        }));
        return forkJoin(detailDTOs.map(d => this.orderService.createOrderDetail(d)));
      })
    ).subscribe({
      next: () => {
        console.log(`Order #${orderNumber} placed successfully!`);
        localStorage.removeItem('cartState');
        this.cartService.countOfCart.next(0);
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Error creating order or details', err);
      }
    });
  }

  returnToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }
}
