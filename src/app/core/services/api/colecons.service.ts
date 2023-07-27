import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Colecom } from 'src/app/modules/colecons/colecom/colecom.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
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

  getColecom(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Colecom?id=' + id);
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

  borrarColecom(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Colecom?id=' + id);
  }
}
