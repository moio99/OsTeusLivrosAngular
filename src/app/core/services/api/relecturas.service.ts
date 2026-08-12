import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Relectura } from '../../models/relectura.interface';
import { Observable } from 'rxjs';
import { Resultado } from '../../models/base-dados-api.interface';

@Injectable({
  providedIn: 'root',
})
export class RelecturasService {

  private rotaIntermedia = '/Relecturas';

  constructor(private http: HttpClient) {
  }

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
