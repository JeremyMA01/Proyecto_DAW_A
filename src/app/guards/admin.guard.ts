import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('currentUser');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    
    const rol = user.rol ? user.rol.toLowerCase() : '';

    if (rol === 'admin' || rol === 'administrador') {
      return true; 
    }
  }

  
  console.log("Acceso denegado por el Guard. Redirigiendo...");
  router.navigate(['/login']); 
  return false;
};