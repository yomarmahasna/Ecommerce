export interface IProducts {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  brand: string;
  model: string;
  color: string;
  category: string;
  quantity:number;
  discount: number;
  popular: boolean;
  isAddedToCart: boolean;
  isAddedToWishlist:boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
export interface Category {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  isActive: boolean;
}
export interface OrderItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  netPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  shippingAddress: string;
  customerNotes?: string;
  feedback?: string;
  items: OrderItem[];
}
export interface Product {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  taxPercentage: number;
  category: string;
  brand: string;
  images: string[]; // URLs أو أسماء ملفات
  isAvailable: boolean;
  lastModifiedDate: string;
  lastModifiedBy: string;
}
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  lastOrderDate: string;
  lastLoginDate: string;
  addresses: string[];
  orders: {
    orderNumber: string;
    orderDate: string;
    totalPrice: number;
    status: string;
    deliveryDate: string;
  }[];
}
export interface Brand {
  id: number;
  nameEn: string;
  nameAr: string;
  imageUrl: string;
  isActive: boolean;
}
