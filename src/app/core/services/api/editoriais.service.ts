import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Editorial, EditorialData } from '../../models/editorial.interface';
import { ListadoEditoriaisData } from '../../models/listado-editoriais.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class EditoriaisService extends BaseApiService<Editorial, EditorialData, ListadoEditoriaisData> {
  protected rotaIntermedia = '/Editoriais';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Editorial';
  }
}
