import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { BaseDadosApi } from '../../models/base-dados-api';

export abstract class BaseApiService<T> {  // clase que a extende BaseApiService<Colecom>
  protected abstract rotaIntermedia: string;              	// De obrigada implementaçom na clase que a extende
  protected cacheData: BaseDadosApi<T> | undefined = undefined;

  constructor(protected http: HttpClient) {}

  // Métodos comuns
  getListado(): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUrl}${this.rotaIntermedia}`);
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoCosLivros(): Observable<BaseDadosApi<T>> {
    const isProdOrPre = this.isProdOrPre();
    if (!isProdOrPre || !this.cacheData) {
      return this.http.get<BaseDadosApi<T>>(`${environment.apiUrl}${this.rotaIntermedia}/${this.rotaIntermedia}CosLivros`);
    } else {
      return of(this.cacheData);
    }
  }

  setListadoCosLivros(dados: BaseDadosApi<T>): void {
    if (this.isProdOrPre()) {
      this.cacheData = dados;
    }
  }

  getPorId(id: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}?id=${id}`);
  }

  getPorNome(nome: string): Observable<BaseDadosApi<T>> {
    return this.http.get<BaseDadosApi<T>>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}PorNome?nome=${nome}`);
  }

  create(item: T): Observable<T> {
    console.debug('engadindo');
    return this.http.post<T>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}`, item);
  }

  update(item: T): Observable<T> {
    console.debug(item);
    return this.http.put<T>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}`, item);
  }

  borrar(id: string): Observable<void> {
    console.debug(id);
    return this.http.delete<void>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}?id=${id}`);
  }

  // Método auxiliar para obter o nome da entidade (Editorial/Colecom/etc)
  protected abstract getEntityName(): string;

  // Método auxiliar para verificar o entorno
  private isProdOrPre(): boolean {
    return environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
  }
}
