import { HttpClient } from '@angular/common/http';
import { first, Observable, of, tap } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { BaseListadoDadosApi, ResultadoMeta } from '../../../shared/models/base-dados';
import { inject } from '@angular/core';

export abstract class BaseApiService<T> {

  /*

  clase que a herda e o fai deste jeito:
  export class ColeconsService extends BaseApiService<Colecom> {

  */

  protected abstract rotaIntermedia: string;              	// De obrigada implementaçom na clase que a extende
  protected cacheData: BaseListadoDadosApi<T> | undefined = undefined;

  private http = inject(HttpClient);

  // Métodos comuns
  getListado(): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUrl}${this.rotaIntermedia}`);
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoCosLivros(): Observable<BaseListadoDadosApi<T>> {
    const isProdOrPre = this.isProdOrPre();
    if (isProdOrPre && this.cacheData) {
      return of(this.cacheData);
    } else {
      return this.http.get<BaseListadoDadosApi<T>>(`${environment.apiUrl}${this.rotaIntermedia}/${this.rotaIntermedia}CosLivros`)
        .pipe(first(),
          tap(resposta => {
            if (isProdOrPre) {
              this.cacheData = resposta;
            }
          })
        );
    }
  }

  getPorId(id: string): Observable<BaseListadoDadosApi<T>> {
    return this.http.get<BaseListadoDadosApi<T>>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}?id=${id}`);
  }

  getPorNome(nome: string): Observable<BaseListadoDadosApi<T>> {
    return this.http.get<BaseListadoDadosApi<T>>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}PorNome?nome=${nome}`);
  }

  create(item: T): Observable<ResultadoMeta> {
    console.debug('engadindo');
    return this.http.post<ResultadoMeta>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}`, item);
  }

  update(item: T): Observable<ResultadoMeta> {
    console.debug(item);
    return this.http.put<ResultadoMeta>(`${environment.apiUrl}${this.rotaIntermedia}/${this.getEntityName()}`, item);
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
