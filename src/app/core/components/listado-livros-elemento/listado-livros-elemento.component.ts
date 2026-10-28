import { Component, input, output } from '@angular/core';
import { ListadoLivros } from '@interfaces';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'omla-listado-livros-elemento',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './listado-livros-elemento.component.html'
})
export class ListadoLivrosElementoComponent {
  livros = input<ListadoLivros[] | undefined>([])
  estaCarregando = input<boolean>(false);
  amosarAutor = input<boolean>(true);
  navegarLivro = output<string>();
  navegarAutor = output<number>();
}
