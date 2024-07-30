import { HttpClient } from '@angular/common/http';
import { Livro } from 'src/app/modules/livros/livro/livro.interface';
import { environment } from 'src/environments/environment';

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

  getListadoLivrosPorIdioma(idioma: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorIdioma?Idioma=' + idioma);
  }

  getListadoLivrosPorAno(ano: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorAno?Ano=' + ano);
  }

  getLivrosPorAutor(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorAutor?id=' + id);
  }

  getListadoLivrosPorGenero(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorGenero?Genero=' + id);
  }

  getLivrosPorEditorial(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorEditorial?id=' + id);
  }

  getLivrosPorBiblioteca(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorBiblioteca?id=' + id);
  }

  getLivrosPorColecom(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/PorColecom?id=' + id);
  }

  getLivro(id: number) {
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

  borrarLivro(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Livro?id=' + id);
  }
}
