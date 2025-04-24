import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genero, GeneroData } from '../../models/genero.interface';
import { ListadoGenerosData } from '../../models/listado-generos.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class GenerosService extends BaseApiService<Genero, GeneroData, ListadoGenerosData> {
  protected rotaIntermedia = '/Generos';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Genero';
  }
}
