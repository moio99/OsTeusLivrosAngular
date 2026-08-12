import { Injectable, signal } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { InformacomPe } from '../../../shared/models/outros.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

	// private abrirMenu$ = new Subject<void>();
	// private cerrarMenu$ = new Subject<void>();
  private readonly _isMenuAberto = signal<boolean>(false);
  readonly isMenuAberto = this._isMenuAberto.asReadonly();

  // private informacom$ = new Subject<InformacomPe | undefined>();
  // private subscriptions = new Subscription();     // Para poder fechar todas as subscripçons a um tempo
  private readonly _informacom = signal<InformacomPe | undefined>(undefined);
  readonly informacom = this._informacom.asReadonly();

  // para o desprazamento vertical na versom movil, quando se fai clic na barra superior de estadísticas.
  readonly contedorScroll = signal<HTMLElement | null>(null);

  // constructor() {
  //   // Para poder fechar todas as subscripçons a um tempo
  //   this.subscriptions.add(this.abrirMenu$.subscribe());
  //   this.subscriptions.add(this.cerrarMenu$.subscribe());
  //   this.subscriptions.add(this.informacom$.subscribe());
  // }

  // public getAbrirMenu() {
  //   // return this.abrirMenu$.asObservable();
  //   this._isMenuAberto.set(true);
  // }

	public abrirMenu(): void {
		// this.abrirMenu$.next();
    this._isMenuAberto.set(true);
    console.log('abrirMenu', this._isMenuAberto());
	}

  // public getCerrarMenu() {
  //   return this.cerrarMenu$.asObservable();
  // }

	public cerrarMenu(): void {
		// this.cerrarMenu$.next();
    this._isMenuAberto.set(false);
	}


  // /**
  //  * Get observable for browser close event.
  //  */
  // public getInformacom(): Observable<InformacomPe | undefined> {
  //   return this.informacom$.asObservable();
  // }

  /**
   * Lanza a Info que está no pe.component, se passamos undefined oculta a barra de Info
   */
  public amosarInfo(info: InformacomPe | undefined) {
    // this.informacom$.next(info);
    this._informacom.set(info);
  }

  // /**
  //  * Fecha as subscripçons
  //  */
	// public unsubscribe(): void {
	// 	// this.abrirMenu$.unsubscribe();
	// 	// this.cerrarMenu$.unsubscribe();
	// 	// this.informacom$.unsubscribe();

  //   this.subscriptions.unsubscribe();
	// }
}
