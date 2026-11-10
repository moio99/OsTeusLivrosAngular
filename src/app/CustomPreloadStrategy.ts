import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeuPreloadStrategy implements PreloadingStrategy {

  // O método preload recibe a ruta e a función que executa a carga ('load')
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Verificamos se a ruta ten 'data.precarregaDoComponhente' como true
    if (route.data && route.data['precarregaDoComponhente']) {
      console.log(`Pre-carregando de forma automática a rota: /${route.path}`);
      return load();
    }
    // Se nom o tem, ignorámola devolvendo um Observável baleiro
    return of(null);
  }
}
