import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { adminGuard } from './core/guards/admin-guard.guard';
import { customerGuard } from './core/guards/customer-guard.guard';


export const routes: Routes = [
  // Admin Layer
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [
      adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./components/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'category-management',
        loadComponent: () =>
          import('./components/category-management/category-management.component').then(m => m.CategoryManagementComponent)
      },
      {
        path: 'customer-management',
        loadComponent: () =>
          import('./components/customer-management/customer-management.component').then(m => m.CustomerManagementComponent)
      },
      {
        path: 'brand-management',
        loadComponent: () =>
          import('./components/brand-management/brand-management.component').then(m => m.BrandManagementComponent)
      },
      {
        path: 'order-management',
        loadComponent: () =>
          import('./components/order-management/order-management.component').then(m => m.OrderManagementComponent)
      },
      {
        path: 'product-management',
        loadComponent: () =>
          import('./components/product-management/product-management.component').then(m => m.ProductManagementComponent)
      }
    ]
  },  // Customer Layer
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],

    children: [

      { path: '', redirectTo: 'home', pathMatch: 'full' },


      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./components/categoriesoverview/categoriesoverview.component').then(m => m.CategoriesoverviewComponent)
      },
      {
        path: 'category/:id',
        loadComponent: () =>
          import('./components/category/category.component')
            .then(m => m.CategoryComponent)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./components/product-details/product-details.component').then(m => m.ProductDetailsComponent)
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./components/searchresults/searchresults.component').then(m => m.SearchResultsComponent)
      },
      {
        path: 'shopping-cart',
        loadComponent: () =>
          import('./components/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      // static pages
      {
        path: 'support',
        loadComponent: () =>
          import('./components/staticpage/support/support.component').then(m => m.SupportComponent)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./components/staticpage/about/about.component').then(m => m.AboutUsComponent)
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
    ]
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
  },

  { path: '**', redirectTo: '/login' },
];
