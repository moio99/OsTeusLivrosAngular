import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { EstiloLiterario } from '../../models/estilos-literarios.interface';

@Injectable({
  providedIn: 'root',
})
export class EstilosLiterariosService {

  private rotaIntermedia = '/EstilosLiterarios';

  constructor(private http: HttpClient) {
  }

  getListadoEstilosLiterarios() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoEstilosLiterariosCosLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstilosLiterariosCosLivros');
  }

  getEstiloLiterario(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario?id=' + id);
  }

  getEstiloLiterarioPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterarioPorNome?nome=' + nome);
  }

  getEstiloLiterarioNome(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterarioNome?id=' + id);
  }

  postEstiloLiterario(estiloLiterario: EstiloLiterario) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario', estiloLiterario);
  }

  putEstiloLiterario(estiloLiterario: EstiloLiterario) {
    console.debug(estiloLiterario);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario', estiloLiterario);
  }

  borrarEstiloLiterario(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario?id=' + id);
  }
}
