import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarregandoService {
  private contadorPeticiones = 0;

  // private carregandoSubject = new BehaviorSubject<boolean>(false);
  // carregando$ = this.carregandoSubject.asObservable();
  private readonly _carregando = signal<boolean>(false);  // pérdese o historico de BehaviorSubject
  readonly carregando = this._carregando.asReadonly();

  amosar(): void {
    if (this.contadorPeticiones === 0) {
      // this.carregandoSubject.next(true);
      this._carregando.set(true);
    }
    this.contadorPeticiones++;
  }

  ocultar(): void {
    this.contadorPeticiones--;

    if (this.contadorPeticiones <= 0) {
      this.contadorPeticiones = 0; // Evita valores negativos
      // this.carregandoSubject.next(false);
      this._carregando.set(false);
    }
  }
}
