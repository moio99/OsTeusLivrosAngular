import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import { Biblioteca } from '../../models/biblioteca.interface';

@Injectable({
  providedIn: 'root',
})
export class BibliotecasService extends BaseApiService<Biblioteca> {
  protected rotaIntermedia = '/Bibliotecas';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Biblioteca';
  }
}
