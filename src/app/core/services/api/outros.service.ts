import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Outros } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class OutrosService {

  private rotaIntermedia = '/Outros';

  constructor(private http: HttpClient) {
  }

  getNacionalidades() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/Nacionalidades');
  }

  getNacionalidadeNome(id: number): Observable<string> {
    return this.http.get<string>(environment.apiUrl + this.rotaIntermedia + '/NacionalidadeNome?id=' + id);
  }

  getPaises() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/Paises');
  }

  getPaisNome(id: number): Observable<string> {
    return this.http.get<string>(environment.apiUrl + this.rotaIntermedia + '/PaisNome?id=' + id);
  }

  getIdiomaNome(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia + '/IdiomaNome?id=' + id);
  }

  getTodo(): Observable<Outros> {
    return this.http.get<Outros>(environment.apiUrl + this.rotaIntermedia + '/Todo');
  }
}
