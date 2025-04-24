import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { EstadisticasTipo } from '../../../shared/enums/estadisticasTipos';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { EstadisticasData } from '../../models/estadisticas.interface';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  private cacheEstadisticasDataIdioma: EstadisticasData | undefined = undefined;
  private cacheEstadisticasDataAno: EstadisticasData | undefined = undefined;
  private cacheEstadisticasDataGenero: EstadisticasData | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  /**
   * Accede à API para obter as Estadísticas dun tipo pasado.
   * Quando nom estea em local guarda umha caché.
   * @param tipo Tipo de estadísticas que se vai obter.
   * @returns Promesa de obtençom dos dados.
   */
   getEstadisticas(tipo: EstadisticasTipo) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      switch (tipo) {
        case EstadisticasTipo.Idioma:
          if (this.cacheEstadisticasDataIdioma) {
            return of(this.cacheEstadisticasDataIdioma);
          }
          break;
        case EstadisticasTipo.Ano:
          if (this.cacheEstadisticasDataAno) {
            return of(this.cacheEstadisticasDataAno);
          }
          break;
        case EstadisticasTipo.Genero:
          if (this.cacheEstadisticasDataGenero) {
            return of(this.cacheEstadisticasDataGenero);
          }
          break
      }
    }
    return this.http.get(environment.apiUrl + '/Estadisticas?tipo=' + tipo);
  }
  setGraficosPaginasPorIdiomaEAno(tipo: EstadisticasTipo, dados: EstadisticasData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      switch (tipo) {
        case EstadisticasTipo.Idioma:
          this.cacheEstadisticasDataIdioma = dados;
          break;
        case EstadisticasTipo.Ano:
          this.cacheEstadisticasDataAno = dados;
          break;
        case EstadisticasTipo.Genero:
          this.cacheEstadisticasDataGenero = dados;
          break;
      }
    }
  }
}
