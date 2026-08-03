import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CarregandoService } from '../services/tools/carregando.service';

// Funçom interceptor
export const carregandoInterceptor: HttpInterceptorFn = (req, next) => {
  const carregandoService = inject(CarregandoService);

  // Amosar o spinner
  carregandoService.amosar();

  // Manexar a solicitude e ocultar ao finalizar
  return next(req).pipe(
    finalize(() => carregandoService.ocultar())
  );
};

// @Injectable()
// export class CarregandoInterceptor implements HttpInterceptor {
//   constructor(private carregandoService: CarregandoService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Amosar o spinner
//     this.carregandoService.amosar();

//     // Manejar a solicitude
//     return next.handle(req).pipe(
//       // Ocultar o spinner ao finalizar a solicitude
//       finalize(() => {
//         this.carregandoService.ocultar();
//       })
//     );
//   }
// }
