import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { inject, Service } from '@angular/core';
import { of } from 'rxjs';
import { GraficosData } from '../../../core/models/graficos.interface';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service({ autoProvided: false })
export class GraficosService {

  private rotaIntermedia = '/Graficos';
  private cacheGraficosPaginasPorIdiomaEAno: GraficosData | undefined = undefined;

  private http = inject(HttpClient);

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
