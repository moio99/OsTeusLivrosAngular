import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { EstadisticasTipo } from '../../../shared/enums/estadisticasTipos';
import { inject, Service } from '@angular/core';
import { of } from 'rxjs';
import { Estadisticas } from '../../../core/models/estadisticas.interface';
import { BaseListadoDadosApi } from '../../../shared/models/base-dados';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service({ autoProvided: false })
export class EstadisticasService {

  private cacheEstadisticasDataIdioma: BaseListadoDadosApi<Estadisticas> | undefined = undefined;
  private cacheEstadisticasDataAno: BaseListadoDadosApi<Estadisticas> | undefined = undefined;
  private cacheEstadisticasDataGenero: BaseListadoDadosApi<Estadisticas> | undefined = undefined;

  private http = inject(HttpClient);

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
  setGraficosPaginasPorIdiomaEAno(tipo: EstadisticasTipo, dados: BaseListadoDadosApi<Estadisticas>) {
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
