import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Relectura } from '@interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Resultado } from '../../../shared/models/base-dados';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida dun só compoñente),
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service({ autoProvided: false })
export class RelecturasService {

  private rotaIntermedia = '/Relecturas';

  private http = inject(HttpClient);

  getRelectura(id: string) {
    console.log('relecturas id', id);
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }

  getRelecturas(idLivro: string) {
    console.log('relecturas idLivro', idLivro);
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Relecturas?id=' + idLivro);
  }

  postRelectura(relectura: Relectura): Observable<Resultado> {
    return this.http.post<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  putRelectura(relectura: Relectura): Observable<Resultado> {
    console.debug('atualizando');
    return this.http.put<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  borrarRelectura(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }
}
