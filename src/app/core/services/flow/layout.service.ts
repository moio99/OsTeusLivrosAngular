import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { InformacomPe } from '../../../shared/models/outros.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

	private abrirMenu$ = new Subject<void>();
	private cerrarMenu$ = new Subject<void>();
  private informacom$ = new Subject<InformacomPe | undefined>();

  constructor() { }

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
   * Rise info event.
   */
  public amosarInfo(info: InformacomPe | undefined) {
    this.informacom$.next(info);
  }
}
