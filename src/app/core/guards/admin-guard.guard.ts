import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';


export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // إذا لم يسجل دخوله
  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  // إذا دوره Admin
  if (auth.getUserRole() === 'Admin') {
    return true;
  }

  // غير مصرح → حوله للزبائن
  return router.parseUrl('/customer/home');
};
