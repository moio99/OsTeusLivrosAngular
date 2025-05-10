import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genero } from '../../models/genero.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class GenerosService extends BaseApiService<Genero> {
  protected rotaIntermedia = '/Generos';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Genero';
  }
}
