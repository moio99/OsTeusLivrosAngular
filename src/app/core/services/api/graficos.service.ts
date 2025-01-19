import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GraficosService {

  private rotaIntermedia = '/Graficos';

  constructor(private http: HttpClient) {
  }

  /**
   * Accede à API para obter os dados dos gráficos, neste caso por Idioma e por Ano.
   * @returns Promesa de obtençom dos dados.
   */
   getGraficosPaginasPorIdiomaEAno() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PaginasPorIdiomaEAno');
  }
}
