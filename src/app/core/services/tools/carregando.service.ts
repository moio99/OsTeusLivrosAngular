import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarregandoService {
  private contadorPeticiones = 0;

  private carregandoSubject = new BehaviorSubject<boolean>(false);
  carregando$ = this.carregandoSubject.asObservable();

  amosar(): void {
    this.carregandoSubject.next(true);
    this.contadorPeticiones++;
  }

  ocultar(): void {
    this.contadorPeticiones--;

    if (this.contadorPeticiones <= 0) {
      this.contadorPeticiones = 0; // Evita valores negativos
      this.carregandoSubject.next(false);
    }
  }
}
