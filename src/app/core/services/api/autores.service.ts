import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ListadosAutoresTipos } from '../../../shared/enums/estadisticasTipos';
import { Injectable } from '@angular/core';
import { Autor } from '../../models/autor.interface';

@Injectable({
  providedIn: 'root',
})
export class AutoresService {

  private rotaIntermedia = '/Autores';

  constructor(private http: HttpClient) {
  }

  getListadoAutores() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoAutoresPorNacons() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/AutoresPorNacons');
  }

  getListadoAutoresPorPaises() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/AutoresPorPaises');
  }

  getListadoAutoresFiltrados(id: number, tipo: ListadosAutoresTipos) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/AutoresFiltrados?id=' + id + '&tipo=' + tipo);
  }

  getAutor(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Autor?id=' + id);
  }

  getAutorPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/AutorPorNome?nome=' + nome);
  }

  postAutor(autor: Autor) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Autor', autor);
  }

  putAutor(autor: Autor) {
    console.debug(autor);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Autor', autor);
  }

  borrarAutor(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Autor?id=' + id);
  }
}
