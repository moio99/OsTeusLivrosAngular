import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colecom, ColecomData } from '../../models/colecom.interface';
import { ListadoColeconsData } from '../../models/listado-colecons.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class ColeconsService extends BaseApiService<Colecom, ColecomData, ListadoColeconsData> {
  protected rotaIntermedia = '/Colecons';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Colecom';
  }
}
