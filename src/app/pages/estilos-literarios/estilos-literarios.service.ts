import { Service } from '@angular/core';
import { EstiloLiterario } from '../../core/models/estilos-literarios.interface';
import { BaseApiService } from '../../core/services/api/base-api.service';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service({ autoProvided: false })
export class EstilosLiterariosService extends BaseApiService<EstiloLiterario> {
  protected rotaIntermedia = '/EstilosLiterarios';

  protected getEntityName(): string {
    return 'EstiloLiterario';
  }
}
