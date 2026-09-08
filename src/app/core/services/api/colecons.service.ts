import { Service } from '@angular/core';
import { Colecom } from '../../models/colecom.interface';
import { BaseApiService } from './base-api.service';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service()
export class ColeconsService extends BaseApiService<Colecom> {
  protected rotaIntermedia = '/Colecons';

  protected getEntityName(): string {
    return 'Colecom';
  }
}
