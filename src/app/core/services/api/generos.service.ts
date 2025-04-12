import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Genero } from '../../models/genero.interface';

@Injectable({
  providedIn: 'root',
})
export class GenerosService {

  private rotaIntermedia = '/Generos';

  constructor(private http: HttpClient) {
  }

  getListadoGeneros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoGenerosCosLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/GenerosCosLivros');
  }

  getGenero(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Genero?id=' + id);
  }

  getGeneroPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/GeneroPorNome?nome=' + nome);
  }

  getGeneroNome(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/GeneroNome?id=' + id);
  }

  postGenero(genero: Genero) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Genero', genero);
  }

  putGenero(genero: Genero) {
    console.debug(genero);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Genero', genero);
  }

  borrarGenero(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Genero?id=' + id);
  }
}
