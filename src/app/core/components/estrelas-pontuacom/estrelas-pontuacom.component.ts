import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { Estrela } from './estrelas-pontuacom.interface';
import { EstrelaComponent } from './estrela/estrela.component';

@Component({
  selector: 'omla-estrelas-pontuacom',
  standalone: true,
  imports: [ EstrelaComponent ],
  templateUrl: './estrelas-pontuacom.component.html',
  styleUrls: ['./estrelas-pontuacom.component.scss']
})
export class EstrelasPontuacomComponent {

  // Inputs e Outputs modernos baseados en Signals
  pontuacomPai = input<number | undefined>(undefined, { alias: 'pontuacom' });
  numero = output<number | undefined>();

  // SOLUCIÓN: Copia automaticamente o valor de pontuacom() ao arrincar
  // e cada vez que cambie desde o pai, pero permite facerlle .set() desde dentro.
  novaPontuacom = linkedSignal(() => this.pontuacomPai());

  // Estado interno gestionado com Signals reactivos
  cantidade = 10;
  estrelaSimulando = signal<Estrela | undefined>(undefined);

  // Estado derivado
  numeroActual = computed(() => {
    // Se se está simulando (hover), amosa o valor simulado
    const simulando = this.estrelaSimulando();
    if (simulando !== undefined) {
      return simulando.numero;
    }

    // Se nom, amosa a nova pontuaçom elixida
    return this.novaPontuacom() ?? 0;
  });

  // Recheo dinámico das estrelas: reacciona só cando cambia 'numeroActual'
  estrelas = computed<Estrela[]>(() => {
    const lista: Estrela[] = [];
    const puntuacionReferencia = this.numeroActual();

    for (let i = 1; i <= this.cantidade; i++) {
      lista.push({
        numero: i,
        marcada: i <= puntuacionReferencia
      });

      if (i < this.cantidade) {
        lista.push({
          numero: i + 0.5,
          marcada: (i + 0.5) <= puntuacionReferencia
        });
      }
    }
    return lista;
  });

  onSimulacom(estrelaDados: Estrela | undefined) {
    this.estrelaSimulando.set(estrelaDados);
  }

  onEstavelecerPontuacom(numero: number) {
    this.novaPontuacom.set(numero); // Actualiza o valor local
    this.numero.emit(numero);       // Avisa ao componhente pai
  }
}
