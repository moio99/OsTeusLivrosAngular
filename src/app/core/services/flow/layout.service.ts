import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { InformacomPe } from '../../../shared/models/outros.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

	private abrirMenu$ = new Subject<void>();
	private cerrarMenu$ = new Subject<void>();
  private informacom$ = new Subject<InformacomPe | undefined>();
  private subscriptions = new Subscription();     // Para poder fechar todas as subscripçons a um tempo

  constructor() {
    // Para poder fechar todas as subscripçons a um tempo
    this.subscriptions.add(this.abrirMenu$.subscribe());
    this.subscriptions.add(this.cerrarMenu$.subscribe());
    this.subscriptions.add(this.informacom$.subscribe());
  }

  public getAbrirMenu() {
    return this.abrirMenu$.asObservable();
  }

	public abrirMenu(): void {
		this.abrirMenu$.next();
	}

  public getCerrarMenu() {
    return this.cerrarMenu$.asObservable();
  }

	public cerrarMenu(): void {
		this.cerrarMenu$.next();
	}


  /**
   * Get observable for browser close event.
   */
  public getInformacom(): Observable<InformacomPe | undefined> {
    return this.informacom$.asObservable();
  }

  /**
   * Lanza a Info que está no pe.component, se passamos undefined oculta a barra de Info
   */
  public amosarInfo(info: InformacomPe | undefined) {
    this.informacom$.next(info);
  }

  /**
   * Fecha as subscripçons
   */
	public unsubscribe(): void {
		// this.abrirMenu$.unsubscribe();
		// this.cerrarMenu$.unsubscribe();
		// this.informacom$.unsubscribe();

    this.subscriptions.unsubscribe();
	}
}
