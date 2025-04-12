import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Editorial } from '../../models/editorial.interface';

@Injectable({
  providedIn: 'root',
})
export class EditoriaisService {

  private rotaIntermedia = '/Editoriais';

  constructor(private http: HttpClient) {
  }

  getListadoEditoriais() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoEditoriaisCosLivros() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EditoriaisCosLivros');
  }

  getEditorial(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Editorial?id=' + id);
  }

  getEditorialPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EditorialPorNome?nome=' + nome);
  }

  postEditorial(editorial: Editorial) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/Editorial', editorial);
  }

  putEditorial(editorial: Editorial) {
    console.debug(editorial);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/Editorial', editorial);
  }

  borrarEditorial(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Editorial?id=' + id);
  }
}
