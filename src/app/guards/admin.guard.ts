import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);


  const userStr = localStorage.getItem('currentUser');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.rol === 'administrador') {
      return true;
    }
  }


  return false;
};