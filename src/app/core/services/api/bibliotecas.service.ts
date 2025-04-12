import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Biblioteca } from '../../models/biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class BibliotecasService {

  private rotaIntermedia = '/Bibliotecas';

  constructor(private http: HttpClient) {
  }

  getListadoBibliotecas() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoBibliotecasCosLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/BibliotecasCosLivros');
  }

  getBiblioteca(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Biblioteca?id=' + id);
  }

  getBibliotecaPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/BibliotecaPorNome?nome=' + nome);
  }

  postBiblioteca(biblioteca: Biblioteca) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Biblioteca', biblioteca);
  }

  putBiblioteca(biblioteca: Biblioteca) {
    console.debug(biblioteca);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Biblioteca', biblioteca);
  }

  borrarBiblioteca(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Biblioteca?id=' + id);
  }
}
