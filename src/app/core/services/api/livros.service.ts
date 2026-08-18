import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Livro } from '../../models/livro.interface';
import { Observable, of } from 'rxjs';
import { ListadoLivros } from '../../models/listado-livros.interface';
import { BaseListadoDadosApi, Resultado } from '../../models/base-dados-api.interface';

@Injectable({
  providedIn: 'root',
})
export class LivrosService {

  private rotaIntermedia = '/Livros';
  private cacheListadoLivrosData: BaseListadoDadosApi<ListadoLivros> | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  /**
   * Quando nom estea em local guarda umha caché
   * @returns
   */
  getListadoLivros(): Observable<BaseListadoDadosApi<ListadoLivros>> {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoLivrosData) {
      return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia + '/');
    } else {
      return of(this.cacheListadoLivrosData);
    }
  }
  setListadoLivros(dados: BaseListadoDadosApi<ListadoLivros>) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoLivrosData = dados;
    }
  }

  private pausa(ms: number) {
    return new Promise( resolve => {setTimeout(resolve, ms); } );
  }

  getListadoLivrosUltimaLectura(): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/UltimaLectura');
  }

  getListadoLivrosPorIdioma(idioma: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorIdioma?Idioma=' + idioma);
  }

  getListadoLivrosPorAno(ano: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorAno?Ano=' + ano);
  }

  getLivrosPorAutor(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorAutor?id=' + id);
  }

  getListadoLivrosPorGenero(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorGenero?Genero=' + id);
  }

  getLivrosPorEditorial(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorEditorial?id=' + id);
  }

  getLivrosPorBiblioteca(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorBiblioteca?id=' + id);
  }

  getLivrosPorColecom(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorColecom?id=' + id);
  }

  getListadoLivrosPorEstiloLiterario(id: string): Observable<BaseListadoDadosApi<ListadoLivros>> {
    return this.http.get<BaseListadoDadosApi<ListadoLivros>>(environment.apiUrl + this.rotaIntermedia
      + '/PorEstiloLiterario?id=' + id);
  }

  getLivro(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Livro?id=' + id);
  }

  getLivroPorTitulo(titulo: string): Observable<BaseListadoDadosApi<Livro>> {
    return this.http.get<BaseListadoDadosApi<Livro>>(environment.apiUrl + this.rotaIntermedia
      + '/LivroPorTitulo?titulo=' + titulo);
  }


  postLivro(livro: Livro): Observable<Resultado> {
    console.debug('engadindo');
    return this.http.post<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Livro', livro);
  }

  putLivro(livro: Livro): Observable<Resultado> {
    console.debug('atualizando');
    return this.http.put<Resultado>(environment.apiUrl + this.rotaIntermedia
      + '/Livro', livro);
  }

  borrarLivro(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Livro?id=' + id);
  }
}
