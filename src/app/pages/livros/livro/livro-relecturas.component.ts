import { Component, computed, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelecturaListado } from '@interfaces';

@Component({
  selector: 'omla-livro-relecturas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livro-relecturas.component.html'
})
export class LivroRelecturasComponent {
  relecturas = input<RelecturaListado[]>([]);
  readonly temRelecturas = computed(() => this.relecturas().length > 0); // só se le umha vez (quando cambia dadosRelecturas) polo que evita a cpu habaliar a expreson cada vez que pinta ou que sucede um evento na página relacionado.
  amosar = input(true);

  editarRelectura = output<string>();
  borrar = output<RelecturaListado>();
}
