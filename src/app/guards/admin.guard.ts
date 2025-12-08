import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Leer usuario del almacenamiento
  const userStr = localStorage.getItem('currentUser');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    // Si es admin, lo dejamos pasar
    if (user.rol === 'administrador') {
      return true;
    }
  }

  // Si no es admin o no está logueado, lo mandamos al login o home
  // Opcional: router.navigate(['/home-components']);
  return false;
};