import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Editorial } from 'src/app/modules/editoriais/editorial/editorial.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
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

  getEditorial(id: number) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/Editorial?id=' + id);
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

  borrarEditorial(id: number) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/Editorial?id=' + id);
  }
}
