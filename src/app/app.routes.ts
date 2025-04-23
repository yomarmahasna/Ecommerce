import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'UserManagment',
    loadComponent: () => import('./components/category-management/category-management.component').then(m => m.CategoryManagementComponent)
  },
  {
    path: 'CustomerManagment',
    loadComponent: () => import('./components/customer-management/customer-management.component').then(m => m.CustomerManagementComponent)
  },
  {
    path: 'brandManagment',
    loadComponent: () => import('./components/brand-management/brand-management.component').then(m => m.BrandManagementComponent)
  },
  {
    path: 'orderManagment',
    loadComponent: () => import('./components/order-management/order-management.component').then(m => m.OrderManagementComponent)
  },
  {
    path: 'ProductManagment',
    loadComponent: () => import('./components/product-management/product-management.component').then(m => m.ProductManagementComponent)
  },
  {
    path: 'categoryManagment',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
    {
    path: 'product/:id',
    loadComponent: () => import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent)
  },
    {
    path: 'shopping-cart',
    loadComponent: () => import('./components/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },

  {
    path: 'checkout',
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'support',
    loadComponent: () => import('./components/staticpage/support/support.component').then(m => m.SupportComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./components/staticpage/about/about.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./components/staticpage/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./components/staticpage/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'shipping',
    loadComponent: () => import('./components/staticpage/shipping/shipping.component').then(m => m.ShippingComponent)
  },
  {
    path: 'copyright',
    loadComponent: () => import('./components/staticpage/copyright/copyright.component').then(m => m.CopyrightComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },  { path: '**', redirectTo: '/auth/signup' },
];
