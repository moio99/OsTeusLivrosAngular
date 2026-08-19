import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListadoLivros } from '@interfaces';

@Component({
  selector: 'omla-autor-livros',
  standalone: true,
  templateUrl: './autor-livros.component.html'
})
export class AutorLivrosComponent {
  @Input() livros: ListadoLivros[] = [];
  @Output() navegar = new EventEmitter<string>();
}
