import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstiloLiterario, EstiloLiterarioData } from '../../models/estilos-literarios.interface';
import { ListadoEstilosLiterariosData } from '../../models/listado-estilos-literarios.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class EstilosLiterariosService extends BaseApiService<EstiloLiterario, EstiloLiterarioData, ListadoEstilosLiterariosData> {
  protected rotaIntermedia = '/EstilosLiterarios';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'EstilosLiterario';
  }
}

/* import { HttpClient } from '@angular/common/http';
import { environment, environments } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { EstiloLiterario } from '../../models/estilos-literarios.interface';
import { of } from 'rxjs';
import { ListadoEstilosLiterariosData } from '../../models/listado-estilos-literarios.interface';

@Injectable({
  providedIn: 'root',
})
export class EstilosLiterariosService {

  private rotaIntermedia = '/EstilosLiterarios';
  private cacheListadoEstilosLiterariosData: ListadoEstilosLiterariosData | undefined = undefined;

  constructor(private http: HttpClient) {
  }

  getListadoEstilosLiterarios() {
    return this.http.get(environment.apiUrl + this.rotaIntermedia);
  }

  getListadoEstilosLiterariosCosLivros() {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (!isProdOrPre || !this.cacheListadoEstilosLiterariosData) {
      return this.http.get(environment.apiUrl + this.rotaIntermedia + '/EstilosLiterariosCosLivros');
    } else {
      return of(this.cacheListadoEstilosLiterariosData);
    }
  }
  setListadoEstilosLiterariosData(dados: ListadoEstilosLiterariosData) {
    const isProdOrPre = environment.whereIAm === environments.pro || environment.whereIAm === environments.pre;
    if (isProdOrPre) {
      this.cacheListadoEstilosLiterariosData = dados;
    }
  }

  getEstiloLiterario(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario?id=' + id);
  }

  getEstiloLiterarioPorNome(nome: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterarioPorNome?nome=' + nome);
  }

  getEstiloLiterarioNome(id: string) {
    return this.http.get(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterarioNome?id=' + id);
  }

  postEstiloLiterario(estiloLiterario: EstiloLiterario) {
    console.debug('engadindo');
    return this.http.post(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario', estiloLiterario);
  }

  putEstiloLiterario(estiloLiterario: EstiloLiterario) {
    console.debug(estiloLiterario);
    return this.http.put(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario', estiloLiterario);
  }

  borrarEstiloLiterario(id: string) {
    console.debug(id);
    return this.http.delete(environment.apiUrl + this.rotaIntermedia
      + '/EstiloLiterario?id=' + id);
  }
}
 */
