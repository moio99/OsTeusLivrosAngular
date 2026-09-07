import { Service } from '@angular/core';
import { Genero } from '../../models/genero.interface';
import { BaseApiService } from './base-api.service';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida dun só compoñente),
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service()
export class GenerosService extends BaseApiService<Genero> {
  protected rotaIntermedia = '/Generos';

  protected getEntityName(): string {
    return 'Genero';
  }
}
