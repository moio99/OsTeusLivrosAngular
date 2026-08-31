import { Component, input, output } from '@angular/core';
import { ListadoLivros } from '@interfaces';

@Component({
  selector: 'omla-listado-livros-elemento',
  standalone: true,
  templateUrl: './listado-livros-elemento.component.html'
})
export class ListadoLivrosElementoComponent {
  livros = input<ListadoLivros[] | undefined>([])
  estaCarregando = input<boolean>(false);
  amosarAutor = input<boolean>(true);
  navegarLivro = output<string>();
  navegarAutor = output<number>();
}
