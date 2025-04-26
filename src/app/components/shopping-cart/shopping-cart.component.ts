import { CartService } from './../../core/service/cart.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { MyProduct } from '../../core/interfaces/http';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private CartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  // إنشاء النموذج التفاعلي بناءً على محتويات السلة في localStorage
  buildForm(): void {
    const items = this.loadCartItems();
    this.cartForm = this.fb.group({
      items: this.fb.array(items),
      specialNotes: ['']
    });
  }

  // جلب بيانات السلة وبناء FormGroup لكل عنصر
  loadCartItems(): FormGroup[] {
    const storedCart = localStorage.getItem('cartState');
    const products: MyProduct[] = storedCart ? JSON.parse(storedCart) : [];
    return products.map(product => {
      if (!product.quantity) {
        product.quantity = 1;
      }
      return this.fb.group({
        id: [product.id],
        title: [product.name],
        price: [product.price],
        quantity: [product.quantity],
        image: [product.imageUrl]
      });
    });
  }

  // getter للوصول إلى FormArray
  get items(): FormArray {
    return this.cartForm.get('items') as FormArray;
  }

  // عند تغيير الكمية، نقوم بحفظ التغييرات في localStorage
  updateQuantity(index: number): void {
    // يمكن إضافة تحقق إضافي إذا رغبت
    this.saveCart();
  }

  // إزالة عنصر من السلة
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.saveCart();
    this.CartService.countOfCart.next(this.items.length);
  }

  // حفظ بيانات السلة في localStorage
  saveCart(): void {
    const cartData = this.items.value;
    localStorage.setItem('cartState', JSON.stringify(cartData));
  }

  // حساب الإجمالي بناءً على السعر والكمية لكل عنصر
  get totalPrice(): number {
    return this.items.value.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
