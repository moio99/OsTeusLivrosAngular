import { Component, input, output } from '@angular/core';
import { ListadoLivros } from '@interfaces';

@Component({
  selector: 'omla-autor-livros',
  standalone: true,
  templateUrl: './autor-livros.component.html'
})
export class AutorLivrosComponent {
  livros = input<ListadoLivros[] | undefined>([])
  estaCarregando = input<boolean>(false);
  navegar = output<string>();
}
