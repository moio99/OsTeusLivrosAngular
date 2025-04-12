import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/flow/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const usuarioLogado = this.authService.getUsuarioLogado();

    if (token !== null && usuarioLogado !== undefined) {
      const clonedRequest = req.clone({
        setHeaders: {
          usuarinho: `${usuarioLogado?.nome}`,
          rolroleiro: `${usuarioLogado?.id}`,
          authorization: `Bearer ${token}`
        }
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }

}
