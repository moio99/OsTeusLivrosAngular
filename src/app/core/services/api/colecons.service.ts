import { Service } from '@angular/core';
import { Colecom } from '../../models/colecom.interface';
import { BaseApiService } from './base-api.service';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class ColeconsService extends BaseApiService<Colecom> {
  protected rotaIntermedia = '/Colecons';

  protected getEntityName(): string {
    return 'Colecom';
  }
}
