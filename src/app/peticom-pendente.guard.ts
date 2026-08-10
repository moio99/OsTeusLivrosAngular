import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { OutrosService } from './core/services/api/outros.service';
import { Observable } from 'rxjs';

// Define o tipo para o componente que implementa a lógica de "canDeactivate"
export interface PeticomPendenteComponent {
  podoDeactivate: () => boolean | Promise<boolean> | Observable<boolean>;
}

export const PeticomPendenteRequestGuard: CanDeactivateFn<PeticomPendenteComponent> = (
  component: PeticomPendenteComponent
) => {
  const todoService = inject(OutrosService); // Si necesitas el servicio en el Guard

  // Úsa-se se o componente tem podoDeactivate(), setá posto em EstadisticasComponent com implements
  // no app.routes.ts para ir ao EstadisticasComponent tem canDeactivate: [PeticomPendenteRequestGuard]
  return component.podoDeactivate ? component.podoDeactivate() : true;
};
