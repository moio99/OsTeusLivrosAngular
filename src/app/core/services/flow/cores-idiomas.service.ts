import { Service } from '@angular/core';
import { CORES_IDIOMAS } from '../../../shared/cores.idiomas.config';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class CoresIdiomasService {
  constructor() { }
  getCoresIdiomas() { return CORES_IDIOMAS; }
}
