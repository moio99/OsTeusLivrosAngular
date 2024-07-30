import { HttpClient } from '@angular/common/http';
import { Genero } from 'src/app/shared/models/outros';
import { environment } from 'src/environments/environment';

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

  getGenero(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Genero?id=' + id);
  }

  getGeneroPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/GeneroPorNome?nome=' + nome);
  }

  getGeneroNome(id: number) {
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

  borrarGenero(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Genero?id=' + id);
  }
}
