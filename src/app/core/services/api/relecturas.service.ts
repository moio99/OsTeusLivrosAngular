import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Relectura } from 'src/app/modules/livros/livro/relectura.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelecturasService {

  private rotaIntermedia = '/Relecturas';

  constructor(private http: HttpClient) {
  }

  getRelectura(id: number) {
    console.log('relecturas id', id);
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }

  getRelecturas(idLivro: number) {
    console.log('relecturas idLivro', idLivro);
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Relecturas?id=' + idLivro);
  }

  postRelectura(relectura: Relectura) {
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  putRelectura(relectura: Relectura) {
    console.debug('atualizando');
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Relectura', relectura);
  }

  borrarRelectura(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Relectura?id=' + id);
  }
}
