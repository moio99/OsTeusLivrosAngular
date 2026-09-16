import { Service } from '@angular/core';
import { Genero } from '../../models/genero.interface';
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
export class GenerosService extends BaseApiService<Genero> {
  protected rotaIntermedia = '/Generos';

  protected getEntityName(): string {
    return 'Genero';
  }
}
