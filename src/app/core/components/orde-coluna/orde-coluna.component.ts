import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'omla-orde-coluna',
  standalone: true,
  templateUrl: './orde-coluna.component.html',
  styleUrls: ['./orde-coluna.component.scss']
})
export class OrdeColunaComponent {
  // Inputs baseados en Signals con valores por defecto
  abcd = input<string>('↓');
  dcba = input<string>('↑');
  nome = input<string>('');

  // Inputs con alias (reemprazan os antigos setters)
  actual = input<string>('', { alias: 'actual' });
  inverso = input<boolean>(false, { alias: 'inverso' });

  // Sinal computado: calcúlase automaticamente cando cambia calquera input
  caracter = computed(() => {
    if (this.actual() === this.nome()) {
      return this.inverso() ? this.dcba() : this.abcd();
    }
    return '';
  });
}
