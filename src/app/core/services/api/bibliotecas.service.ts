import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListadoBibliotecasData } from '../../models/listado-bibliotecas.interface';
import { BaseApiService } from './base-api.service.ts';
import { Biblioteca, BibliotecaData } from '../../models/biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class BibliotecasService extends BaseApiService<Biblioteca, BibliotecaData, ListadoBibliotecasData> {
  protected rotaIntermedia = '/Bibliotecas';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Biblioteca';
  }
}
/* import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Biblioteca } from '../../models/biblioteca.interface';
import { of } from 'rxjs';
import { ListadoBibliotecasData } from '../../models/listado-bibliotecas.interface';

@Injectable({
  providedIn: 'root',
})
export class BibliotecasService {

  private rotaIntermedia = '/Bibliotecas';
  private cacheListadoBibliotecasData: ListadoBibliotecasData | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  getListadoBibliotecas() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoBibliotecasCosLivros() {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoBibliotecasData) {
      return this.http.get(environment.apiUrl + this.rotaIntermedia + '/BibliotecasCosLivros');
    } else {
      return of(this.cacheListadoBibliotecasData);
    }
  }
  setListadoBibliotecasCosLivros(dados: ListadoBibliotecasData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoBibliotecasData = dados;
    }
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
 */
