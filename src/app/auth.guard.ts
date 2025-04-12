import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/flow/auth.service';
import { environment } from '../environments/environment';

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

  console.log('>>>>>>>>>>>>>>>>>>>>>>>>', environment.whereIAm);

  if (authService.estaAutenticado(route.url[0].path)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

/*
CanActivate está deprecado

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/flow/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.estaAutenticado(route.url[0].path)) {
      return true;
    } else {
      this.router.navigate(['/estadisticas']);
      return false;
    }
  }
} */
