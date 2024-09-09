import { Pipe, PipeTransform } from '@angular/core';
import { SimpleObjet } from '../models/outros.model';

@Pipe({
  name: 'filtroListDrag',
  standalone: true
})
export class FiltroListDragPipe implements PipeTransform {

  transform(value: SimpleObjet[], filtro: string, dummy: number): any {
    if (!value || !filtro) return value;

    let filtroPequeno = filtro.toLocaleLowerCase();

    /* let totalGenerosFiltrado: SimpleObjet[] = [];
    value.forEach(elemento => {
      let atopado = elemento.value.toLocaleLowerCase().indexOf(filtroPequeno);
      if (atopado > -1)
        totalGenerosFiltrado.push(elemento);
    });
    return totalGenerosFiltrado; */

    return value.filter(elemento => elemento.value.toLowerCase().includes(filtroPequeno));
  }
}
