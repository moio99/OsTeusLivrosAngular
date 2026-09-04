import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { Injectable } from '@angular/core';
import { Autor, AutorData } from '../../models/autor.interface';
import { Observable, of } from 'rxjs';
import { ListadoAutores, ListadoConcretoAutoresData } from '../../models/listado-autores.interface';
import { BaseQuantidadesLivros } from '../../models/quantidades.interface';
import { BaseListadoDadosApi, ResultadoMeta } from '../../../shared/models/base-dados';

@Injectable({
  providedIn: 'root',
})
export class AutoresService {

  private rotaIntermedia = '/Autores';
  private cacheListadoAutoresData: BaseListadoDadosApi<ListadoAutores> | undefined = undefined;
  private cacheListadoAutoresPorNacons: ListadoConcretoAutoresData | undefined = undefined;
  private cacheListadoAutoresPorPaises: ListadoConcretoAutoresData | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoAutores(): Observable<BaseListadoDadosApi<ListadoAutores>> {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoAutoresData) {
      return this.http.get<BaseListadoDadosApi<ListadoAutores>>(`${environment.apiUrl}${this.rotaIntermedia}`);
    } else {
      return of(this.cacheListadoAutoresData);
    }
  }
  setListadoAutores(dados: BaseListadoDadosApi<ListadoAutores>) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoAutoresData = dados;
    }
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoAutoresPorNacons(): Observable<ListadoConcretoAutoresData> {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoAutoresPorNacons) {
      return this.http.get<ListadoConcretoAutoresData>(`${environment.apiUrl}${this.rotaIntermedia}/AutoresPorNacons`);
    } else {
      return of(this.cacheListadoAutoresPorNacons);
    }
  }

  setListadoAutoresPorNacons(dados: ListadoConcretoAutoresData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoAutoresPorNacons = dados;
    }
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoAutoresPorPaises(): Observable<ListadoConcretoAutoresData> {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoAutoresPorPaises) {
      return this.http.get<ListadoConcretoAutoresData>(`${environment.apiUrl}${this.rotaIntermedia}/AutoresPorPaises`);
    } else {
      return of(this.cacheListadoAutoresPorPaises);
    }
  }

  setListadoAutoresPorPaises(dados: ListadoConcretoAutoresData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoAutoresPorPaises = dados;
    }
  }

  getListadoAutoresFiltrados(id: number, tipo: ListadosAutoresTipos): Observable<BaseListadoDadosApi<ListadoAutores>> {
    const params = new HttpParams()
      .set('id', id)
      .set('tipo', tipo);
    return this.http.get<BaseListadoDadosApi<ListadoAutores>>(`${environment.apiUrl}${this.rotaIntermedia}/AutoresFiltrados`, { params });
  }

  getAutor(id: string): Observable<BaseListadoDadosApi<Autor>> {
    const params = new HttpParams().set('id', id);
    return this.http.get<BaseListadoDadosApi<Autor>>(`${environment.apiUrl}${this.rotaIntermedia}/Autor`, { params });
  }

  getAutorPorNome(nome: string): Observable<AutorData<Autor>> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<AutorData<Autor>>(`${environment.apiUrl}${this.rotaIntermedia}/AutorPorNome`, { params });
  }

  postAutor(autor: Autor): Observable<ResultadoMeta> {
    console.debug('engadindo autor...');
    return this.http.post<ResultadoMeta>(`${environment.apiUrl}${this.rotaIntermedia}/Autor`, autor);
  }

  putAutor(autor: Autor): Observable<ResultadoMeta> {
    console.debug(autor);
    return this.http.put<ResultadoMeta>(`${environment.apiUrl}${this.rotaIntermedia}/Autor`, autor);
  }

  borrarAutor(id: number) {
    console.debug(id);
    const params = new HttpParams().set('id', id);
    return this.http.delete<BaseQuantidadesLivros>(`${environment.apiUrl}${this.rotaIntermedia}/Autor`, { params });
  }
}
