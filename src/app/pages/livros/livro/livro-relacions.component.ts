import { Component, computed, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'omla-livro-relacions',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './livro-relacions.component.html',
  styleUrls: ['./livro-relacions.component.scss']
})
export class LivroRelacionsComponent {
  autoresLivro = input<SimpleObjet[]>([]);
  generosLivro = input<SimpleObjet[]>([]);
  modo = input(EstadosPagina.soVisualizar);

  readonly temAutoresLivro = computed(() => this.autoresLivro().length > 1); // só se le umha vez (quando cambia autoresLivro) polo que evita a cpu habaliar a expreson cada vez que pinta ou que sucede um evento na página relacionado.
  readonly temGenerosLivro = computed(() => this.generosLivro().length > 1); // só se le umha vez (quando cambia generosLivro) polo que evita a cpu habaliar a expreson cada vez que pinta ou que sucede um evento na página relacionado.

  readonly estadosPagina = EstadosPagina;

  gestionarAutores = output<void>();
  engadirAutor = output<void>();
  gestionarGeneros = output<void>();
  engadirGenero = output<void>();
  navegarAutor = output<number>();
  navegarGenero = output<number>();
}
