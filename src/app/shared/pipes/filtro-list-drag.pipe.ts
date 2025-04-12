import { Pipe, PipeTransform } from '@angular/core';
import { SimpleObjet } from '../models/outros.model';

@Pipe({
  name: 'filtroListDrag',
  standalone: true
})
export class FiltroListDragPipe implements PipeTransform {

  transform(value: SimpleObjet[], filtro: string, dummy: number): any {
    if (!value || !filtro) return value;

    const filtroMinusculas = filtro.toLocaleLowerCase();

    /* let totalGenerosFiltrado: SimpleObjet[] = [];
    value.forEach(elemento => {
      let atopado = elemento.value.toLocaleLowerCase().indexOf(filtroMinusculas);
      if (atopado > -1)
        totalGenerosFiltrado.push(elemento);
    });
    return totalGenerosFiltrado; */

    return value.filter(elemento => elemento.value.toLowerCase().includes(filtroMinusculas));
  }
}
