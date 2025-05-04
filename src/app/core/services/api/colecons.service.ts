import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colecom } from '../../models/colecom.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class ColeconsService extends BaseApiService<Colecom> {
  protected rotaIntermedia = '/Colecons';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Colecom';
  }
}
