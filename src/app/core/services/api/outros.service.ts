import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class OutrosService {

  private rotaIntermedia = '/Outros';

  constructor(private http: HttpClient) {
  }

  getNacionalidades() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/Nacionalidades');
  }

  getNacionalidadeNome(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/NacionalidadeNome?id=' + id);
  }

  getPaises() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/Paises');
  }

  getPaisNome(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/PaisNome?id=' + id);
  }

  getIdiomaNome(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/IdiomaNome?id=' + id);
  }

  getTodo() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/Todo');
  }
}
