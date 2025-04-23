import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { CarregandoService } from '../services/tools/carregando.service';

@Injectable()
export class CarregandoInterceptor implements HttpInterceptor {
  constructor(private carregandoService: CarregandoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Amosar o spinner
    this.carregandoService.amosar();

    // Manejar a solicitude
    return next.handle(req).pipe(
      // Ocultar o spinner ao finalizar a solicitude
      finalize(() => {
        this.carregandoService.ocultar();
      })
    );
  }
}
