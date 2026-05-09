import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getUserRole();

  if (role !== 'Admin') {
    router.navigate(['/hotels']);
    return false;
  }

  return true;
};