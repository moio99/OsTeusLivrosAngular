import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { EstadisticasTipo } from '../../../shared/enums/estadisticasTipos';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
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
