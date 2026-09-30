import { HttpInterceptorFn } from '@angular/common/http';
import { environment, environments } from '../../../environments/environment';

export const noCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Aplicamos os cabeçalhos só se a petiçom é um GET
  if (req.method === 'GET'
    && environment.whereIAm === environments.dev || environment.whereIAm !== environments.test
  ) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Pasamos a petiçom clonada cos novos cabeçalhos ao seguinte passo
    return next(clonedRequest);
  }

  // Se nom é um GET (POST, PUT, DELETE...), continua sem modificar nada
  return next(req);
};
