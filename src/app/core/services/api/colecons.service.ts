import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Colecom } from '../../models/colecom.interface';

@Injectable({
  providedIn: 'root',
})
export class ColeconsService {

  private rotaIntermedia = '/Colecons';

  constructor(private http: HttpClient) {
  }

  getListadoColecons() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoColeconsCosLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/ColeconsCosLivros');
  }

  getColecom(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Colecom?id=' + id);
  }

  getColecomPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/ColecomPorNome?nome=' + nome);
  }

  postColecom(colecom: Colecom) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Colecom', colecom);
  }

  putColecom(colecom: Colecom) {
    console.debug(colecom);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Colecom', colecom);
  }

  borrarColecom(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Colecom?id=' + id);
  }
}
