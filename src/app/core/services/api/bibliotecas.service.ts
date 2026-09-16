import { BaseApiService } from './base-api.service';
import { Biblioteca } from '../../models/biblioteca.interface';
import { Service } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class BibliotecasService extends BaseApiService<Biblioteca> {
  protected rotaIntermedia = '/Bibliotecas';

  protected getEntityName(): string {
    return 'Biblioteca';
  }
}
