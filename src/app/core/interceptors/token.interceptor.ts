import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@servizosFlow';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Uso moderno por medio de umha Funçom

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();
  const usuarioLogado = authService.getUsuarioLogado();

  if (token !== null && usuarioLogado !== undefined) {
    const clonedRequest = req.clone({
      setHeaders: {
        usuarinho: usuarioLogado.nome,
        rolroleiro: String(usuarioLogado.id), // Aseguramos que seja um String
        authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  return next(req);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Verificamos se o erro que chega da API é um 401
      if (error.status === 401) {
        console.warn('Sessom expirada ou nom autorizada. Redireccionando ao login...');
        authService.logout();         // Borro os dados do usuario
        router.navigate(['/login']);
      }

      // Propagamos o erro por se o componhente necesita saber que falhou
      return throwError(() => error);
    })
  );
};

// Uso clásico por medio de umha classe

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService,) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.authService.getToken();
//     const usuarioLogado = this.authService.getUsuarioLogado();

//     if (token !== null && usuarioLogado !== undefined) {
//       const clonedRequest = req.clone({
//         setHeaders: {
//           usuarinho: `${usuarioLogado?.nome}`,
//           rolroleiro: `${usuarioLogado?.id}`,
//           authorization: `Bearer ${token}`
//         }
//       });

//       return next.handle(clonedRequest);
//     }

//     return next.handle(req);
//   }
// }
