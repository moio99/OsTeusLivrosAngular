import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Editorial } from '../../models/editorial.interface';
import { BaseApiService } from './base-api.service.ts';

@Injectable({
  providedIn: 'root',
})
export class EditoriaisService extends BaseApiService<Editorial> {
  protected rotaIntermedia = '/Editoriais';

  constructor(override http: HttpClient) {
    super(http);
  }

  protected getEntityName(): string {
    return 'Editorial';
  }
}
