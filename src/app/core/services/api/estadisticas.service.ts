import { HttpClient } from '@angular/common/http';
import { EstadisticasTipo } from 'src/app/shared/enums/estadisticasTipos'
import { environment } from 'src/environments/environment';

export class EstadisticasService {

  constructor(private http: HttpClient) {
  }

  /**
   * Accede à API para obter as Estadísticas dun tipo pasado.
   * @param tipo Tipo de estadísticas que se vai obter.
   * @returns Promesa de obtençom dos dados.
   */
   getEstadisticas(tipo: EstadisticasTipo) {
    return this.http.get(environment.apiUrl
      + '/Estadisticas?tipo=' + tipo);
  }
}
