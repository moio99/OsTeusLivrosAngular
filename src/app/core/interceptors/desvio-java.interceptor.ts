import { HttpInterceptorFn } from '@angular/common/http';
import { environment, environments } from '../../../environments/environment';

export const desvioJava: HttpInterceptorFn = (req, next) => {
  let porto = window.location.port || '4210'; // para poder fazer no package.json "devJava": "ng serve --port 4211"
  let eBibliotecas = req.url.includes('/Bibliotecas')

  if (porto === '4211' && eBibliotecas
    && (environment.whereIAm === environments.dev || environment.whereIAm === environments.test)
    && req.method === 'GET') {

    const urlOriginal = new URL(req.url, window.location.origin);
    urlOriginal.port = environment.portoJava;
    const novaReq = req.clone({
      url: urlOriginal.toString()
    });

    // 4. Enviamos a petición modificada
    return next(novaReq);
  }

  return next(req);
};
