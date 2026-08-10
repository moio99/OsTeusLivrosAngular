import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/flow/auth.service';

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
