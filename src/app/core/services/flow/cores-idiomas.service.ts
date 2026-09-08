import { Service } from '@angular/core';
import { CORES_IDIOMAS } from '../../../shared/cores.idiomas.config';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service()
export class CoresIdiomasService {
  constructor() { }
  getCoresIdiomas() { return CORES_IDIOMAS; }
}
