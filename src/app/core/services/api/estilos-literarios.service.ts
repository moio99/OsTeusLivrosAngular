import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstiloLiterario } from '../../models/estilos-literarios.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class EstilosLiterariosService extends BaseApiService<EstiloLiterario> {
  protected rotaIntermedia = '/EstilosLiterarios';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'EstiloLiterario';
  }
}
