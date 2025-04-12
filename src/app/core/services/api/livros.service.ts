import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Livro } from '../../models/livro.interface';

@Injectable({
  providedIn: 'root',
})
export class LivrosService {

  private rotaIntermedia = '/Livros';

  constructor(private http: HttpClient) {
  }

  getListadoLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/');
  }

  getListadoLivrosUltimaLectura() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/UltimaLectura');
  }

  getListadoLivrosPorIdioma(idioma: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorIdioma?Idioma=' + idioma);
  }

  getListadoLivrosPorAno(ano: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorAno?Ano=' + ano);
  }

  getLivrosPorAutor(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorAutor?id=' + id);
  }

  getListadoLivrosPorGenero(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorGenero?Genero=' + id);
  }

  getLivrosPorEditorial(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorEditorial?id=' + id);
  }

  getLivrosPorBiblioteca(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorBiblioteca?id=' + id);
  }

  getLivrosPorColecom(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorColecom?id=' + id);
  }

  getListadoLivrosPorEstiloLiterario(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorEstiloLiterario?id=' + id);
  }

  getLivro(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Livro?id=' + id);
  }

  getLivroPorTitulo(titulo: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/LivroPorTitulo?titulo=' + titulo);
  }


  postLivro(livro: Livro) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Livro', livro);
  }

  putLivro(livro: Livro) {
    console.debug('atualizando');
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Livro', livro);
  }

  borrarLivro(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Livro?id=' + id);
  }
}
