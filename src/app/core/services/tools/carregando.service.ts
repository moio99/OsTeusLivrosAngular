import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarregandoService {
  private carregandoSubject = new BehaviorSubject<boolean>(false);
  carregando$ = this.carregandoSubject.asObservable();

  amosar(): void {
    this.carregandoSubject.next(true);
  }

  ocultar(): void {
    this.carregandoSubject.next(false);
  }
}
