import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard funcional: protege las rutas internas redirigiendo al login
 * si no existe una sesión válida (token presente).
 * 
 * Modo demo: si existe la variable 'cg_demo_mode' en localStorage con valor 'true',
 * bypass la autenticación para permitir testing sin login interactivo.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Modo demo para testing headless
  if (localStorage.getItem('cg_demo_mode') === 'true') {
    return true;
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Guard funcional: permite el acceso únicamente a usuarios con rol ADMIN.
 * Debe usarse después de authGuard.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getUsuario()?.role === 'ADMIN') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
