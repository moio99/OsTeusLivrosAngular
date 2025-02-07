import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'tocotom-tocotom-pom-pom';

    const clonedRequest = req.clone({
      setHeaders: {
        usuarinho: 'Lector01',
        rolroleiro: 'Usuario',              // nom vale rolRoleiro
        authorization: `Bearer ${token}`    // nom vale Authorization
      }
    });

    // Manejar la solicitud
    return next.handle(clonedRequest);
  }
}
