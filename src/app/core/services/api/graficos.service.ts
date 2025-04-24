import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { GraficosData } from '../../models/graficos.interface';

@Injectable({
  providedIn: 'root',
})
export class GraficosService {

  private rotaIntermedia = '/Graficos';
  private cacheGraficosPaginasPorIdiomaEAno: GraficosData | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  /**
   * Accede à API para obter os dados dos gráficos, neste caso por Idioma e por Ano.
   * Quando nom estea em local guarda umha caché.
   * @returns Promesa de obtençom dos dados.
   */
   getGraficosPaginasPorIdiomaEAno() {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheGraficosPaginasPorIdiomaEAno) {
      return this.http.get(environment.apiUrl + this.rotaIntermedia + '/PaginasPorIdiomaEAno');
    } else {
      return of(this.cacheGraficosPaginasPorIdiomaEAno);
    }
  }
  setGraficosPaginasPorIdiomaEAno(dados: GraficosData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheGraficosPaginasPorIdiomaEAno = dados;
    }
  }
}
