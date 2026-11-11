import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Relectura, RelecturaData } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseListadoDadosApi, Resultado } from '../../../shared/models/base-dados';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service({ autoProvided: false })
export class RelecturasService {

  private rotaIntermedia = '/Relecturas';

  private http = inject(HttpClient);

  getRelectura(id: string): Observable<RelecturaData> {
    return this.http.get<RelecturaData>(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }

  getRelecturas(idLivro: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Relecturas?id=' + idLivro);
  }

  getRelecturasPorTitulo(idLivro: string, titulo: string): Observable<BaseListadoDadosApi<RelecturaData>> {
    return this.http.get<BaseListadoDadosApi<RelecturaData>>(environment.apiUrl + this.rotaIntermedia
      + `/RelecturasPorTitulo?idLivro=${idLivro}&titulo=${titulo}`);
  }

  getRelecturasSerie(id: string): Observable<BaseListadoDadosApi<RelecturaData>> {
    return this.http.get<BaseListadoDadosApi<RelecturaData>>(environment.apiUrl + this.rotaIntermedia
      + '/PorIdSerie?id=' + id);
  }

  postRelectura(relectura: Relectura): Observable<Resultado> {
    return this.http.post<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  putRelectura(relectura: Relectura): Observable<Resultado> {
    return this.http.put<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  borrarRelectura(id: string) {
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }
}
