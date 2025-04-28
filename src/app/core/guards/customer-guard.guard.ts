// src/app/guards/customer.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


export const customerGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // إذا لم يسجل دخوله
  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  // إذا دوره Customer
  if (auth.getUserRole() === 'Customer') {
    return true;
  }

  // غير مصرح → حوله للأدمن
  return router.parseUrl('/admin/dashboard');
};
