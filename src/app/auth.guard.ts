import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './core/services/flow/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos 'state.url' para evitar o erro de 'route.url[0]' se a ruta vén baleira
  if (authService.estaAutenticado(state.url)) {
    return true;
  }

  // Devolvemos o UrlTree directamente para que Angular faga a redirección nativa
  return router.createUrlTree(['/login']);
};

