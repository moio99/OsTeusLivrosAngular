import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomPreloadStrategy implements PreloadingStrategy {

  // O método preload recibe a ruta e a función que executa a carga ('load')
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Verificamos se a ruta ten 'data.preload' como true
    if (route.data && route.data['preload']) {
      console.log(`Precarregando de forma automática a ruta: /${route.path}`);
      return load();
    }
    // Se non o ten, ignorámola devolvendo un Observable baleiro
    return of(null);
  }
}
