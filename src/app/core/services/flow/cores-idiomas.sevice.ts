import { Injectable } from '@angular/core';
import { CORES_IDIOMAS } from '../../../shared/cores.idiomas.config';

@Injectable({ providedIn: 'root' })
export class CoresIdiomasService {
  constructor() { }
  getCoresIdiomas() { return CORES_IDIOMAS; }
}
