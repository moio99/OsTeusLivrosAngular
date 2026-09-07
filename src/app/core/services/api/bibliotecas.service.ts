import { BaseApiService } from './base-api.service';
import { Biblioteca } from '../../models/biblioteca.interface';
import { Service } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida dun só compoñente),
// configúrase cunha propiedade simple: @Service({ autoProvided: false }) neste caso também há que meter:
// providers: [EstadisticasService],
@Service()
export class BibliotecasService extends BaseApiService<Biblioteca> {
  protected rotaIntermedia = '/Bibliotecas';

  protected getEntityName(): string {
    return 'Biblioteca';
  }
}
