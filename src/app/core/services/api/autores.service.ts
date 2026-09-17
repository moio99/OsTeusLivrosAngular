import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { inject, Service } from '@angular/core';
import { Autor, AutorData, ParametrosAutor } from '../../models/autor.interface';
import { Observable, of, tap } from 'rxjs';
import { ListadoAutores, ListadoConcretoAutoresData } from '../../models/listado-autores.interface';
import { BaseQuantidadesLivros } from '../../models/quantidades.interface';
import { BaseListadoDadosApi, ResultadoMeta } from '../../../shared/models/base-dados';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class AutoresService {

  private rotaIntermedia = '/Autores';
  private cacheListadoAutoresData: BaseListadoDadosApi<ListadoAutores> | undefined = undefined;
  private cacheListadoAutoresParametros: ParametrosAutor | null = null;
  private cacheListadoAutoresPorNacons: ListadoConcretoAutoresData | undefined = undefined;
  private cacheListadoAutoresPorPaises: ListadoConcretoAutoresData | undefined = undefined;

  private http = inject(HttpClient);

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoAutores(): Observable<BaseListadoDadosApi<ListadoAutores>> {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;

    if (!isProdOrPre || !this.cacheListadoAutoresData || this.cacheListadoAutoresParametros) {
      this.cacheListadoAutoresParametros = null;
      return this.http.get<BaseListadoDadosApi<ListadoAutores>>(`${environment.apiUrl}${this.rotaIntermedia}`).pipe(
        tap(resposta => {
          if (isProdOrPre) {
            this.cacheListadoAutoresData = resposta;
            this.cacheListadoAutoresParametros = null;
          }
        })
      );
    } else {
      return of(this.cacheListadoAutoresData);
    }
  }
  setListadoAutores(dados: BaseListadoDadosApi<ListadoAutores>, parametros: ParametrosAutor | null) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoAutoresData = dados;
      this.cacheListadoAutoresParametros = parametros;
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

  getListadoAutoresFiltrados(parametros: ParametrosAutor): Observable<BaseListadoDadosApi<ListadoAutores>> {
    const parametrosCambiarom = JSON.stringify(parametros) !== JSON.stringify(this.cacheListadoAutoresParametros);
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;

    if (!isProdOrPre || !this.cacheListadoAutoresData || parametrosCambiarom) {
      const params = new HttpParams()
        .set('id', parametros.id)
        .set('tipo', parametros.tipo);
      return this.http.get<BaseListadoDadosApi<ListadoAutores>>(
        `${environment.apiUrl}${this.rotaIntermedia}/AutoresFiltrados`, { params }).pipe(
            tap(resposta => {
              if (isProdOrPre) {
                this.cacheListadoAutoresData = resposta;
                this.cacheListadoAutoresParametros = parametros;
              }
            })
      );
    } else {
      return of(this.cacheListadoAutoresData);
    }
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
