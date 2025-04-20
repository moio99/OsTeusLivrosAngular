import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/flow/auth.service';

export const authGuard = (        // Isto é umha funçom
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(AuthService); // Obtener el servicio usando `inject`
  const router = inject(Router); // Obtener el Router usando `inject`

  if (authService.estaAutenticado(route.url[0].path)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
