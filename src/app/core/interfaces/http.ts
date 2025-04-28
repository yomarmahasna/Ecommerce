export interface IProducts {
  id: number;
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
  imageUrl: string; // URLs أو أسماء ملفات
  isAvailable: boolean;
  // lastModifiedDate: string;
  // lastModifiedBy: string;
}
export interface MyProduct {
  id: number;
  name: string;
  nameAr: string | null;
  descriptionEn: string;
  descriptionAr: string | null;
  price: number;
  taxPercentage: number;
  quantity:number;
  availabilityStatusId: number;
  categoryId: number;
  brandId: number;
  isActive: boolean;
  creationDate: string;      // أو Date
  imageUrl: string;      // ← هذا ضروري
  isAddedToCart: boolean;
  isAddedToWishlist:boolean;
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

export interface RegisterDto {
  id:               number;
  name:             string;
  isActive:         boolean;
  creationDate:     string;
  email:            string;
  password:         string;
  roleId:           number;
  phone:            string;
  address:          string;
  customerStatusId: number;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface LoginResponse  {
  token: string;
  // أو أي بيانات أخرى يعيدها السيرفر
}
export interface OrderDto {
  id:                  number;
  name:                string;
  orderNumber:         string;
  deliveryDate:        string;
  totalPrice:          number;
  orderStatusId:       number;
  shippingCity:        string;
  shippingStreet:      string;
  shippingBuildingNumber: string;
  customerId:          number;
  rating:              number;
  feedback:            string;
}

export interface OrderDetailDto {
  name:          string;
  isActive:      boolean;
  creationDate:  string;
  orderId:       number;
  productId:     number;
  unitPrice:     number;
  quantity:      number;
  netPrice:      number;
}
export interface UserDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

export interface UpdateUserDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  creationDate: string;      // ISO string: مثلاً new Date().toISOString()
  password: string;
  roleId: number;
  phone: string;
  address: string;
  customerStatusId: number;
}export interface CreateBrandDto {
  // id: number;
  name: string;
  nameAr: string;
  imageUrl?: string;
  isActive: boolean;
  creationDate: string;
}

export interface UpdateBrandDto extends CreateBrandDto {
  id: number;
}

export interface Brand {
  id: number;
  nameAr: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
  creationDate: string;
}
///////////////////////////////////////////////////////////////////////
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  creationDate: string;    // ISO string
  roleId: number;          // 0 = Customer, 1 = Admin
  customerStatusId: number;
}

export interface CreateUserDto {
  id: number;             // عند الإنشاء: 0
  name: string;
  isActive: boolean;      // true
  creationDate: string;   // مثال: new Date().toISOString()
  email: string;
  password: string;
  roleId: number;
  phone: string;
  address: string;
  customerStatusId: number;       // add this field if your backend needs it
}

export interface ChangePasswordDto {
  userId: number;
  newPasswordHash: string;
}

export interface AssignRoleDto {
  userId: number;
  roleId: number;
}
export interface OrderManagment {
  id: number;
  name: string;
  orderNumber: string;
  deliveryDate: string;         // ISO string
  totalPrice: number;
  orderStatusId: number;        // كود الحالة
  shippingCity: string;
  shippingStreet: string;
  shippingBuildingNumber: string;

  customerId: number;
  rating: number;
  feedback: string;
  // الخاصية status نصيّة فقط للعرض في الـ UI
  status?: string;
  // لو تحتاج تعرض تفاصيل الأصناف بعد جلبها من باك-إند
  items?: {
    productName: string;
    unitPrice: number;
    quantity: number;
    netPrice: number;
  }[];
//عشان اقدر اشبك اليوز مع الاوردر
    customerName?: string;
    customerPhone?: string;
    orderDate?: string;
}

export interface Category {
  id: number;
  name: string;           // maps to “name” in payload
  isActive: boolean;
  creationDate: string;   // ISO string
  nameAR: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
}

// This is the exact payload shape for Create & Update:
export interface CategoryDto {
  id: number;             // 0 on Create, existing id on Update
  name: string;
  isActive: boolean;
  creationDate: string;
  nameAR: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
}
export interface Product {
  id: number;
  name: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  taxPercentage: number;
  categoryId: number;
  brandId: number;
  images: string[];              // URLs
  availabilityStatusId: number;  // 1=in stock, 0=out of stock, etc.
  lastModifiedDate: string;      // ISO
  lastModifiedBy: string;
}

// -- Payload shape for Create/Update
export interface ProductDto {
  id: number;                    // 0 for create
  name: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  creationDate : string;
  taxPercentage: number;
  categoryId: number;
  brandId: number;
  isActive:boolean;
  availabilityStatusId : number,
  imageUrl: string;
}
