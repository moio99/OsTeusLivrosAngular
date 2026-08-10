import { Component, computed, input, output } from '@angular/core';
import { Estrela } from '../estrelas-pontuacom.interface';
import { environment, environments } from '../../../../../environments/environment';

@Component({
  selector: 'omla-estrela',
  standalone: true,
  imports: [],
  templateUrl: './estrela.component.html',
  styleUrls: ['./estrela.component.scss']
})
export class EstrelaComponent {

  // RUTA DE IMAXES CONSTANTES
  readonly estrelaBranca = '/assets/images/estrela01.gif';
  readonly estrelaVermelha = '/assets/images/estrela02.gif';

  // Inputs como Sinais
  numero = input<number>(-1);
  simulandoPontuacom = input<Estrela | undefined>(undefined);
  estavelecerNovaPontuacom = input<number | undefined>(undefined);

  // Outputs baseados en Sinais
  simulacomEvent = output<Estrela | undefined>(); // Permitimos 'undefined' para cando sae o rato
  estavelecerPontuacomEvent = output<number>();

  // Estado derivado reactivo (Computed)
  imagemOriginal = computed(() => {
    const novoNumero = this.estavelecerNovaPontuacom();
    const meuNumero = this.numero();

    if (novoNumero !== undefined && meuNumero <= novoNumero) {
      return this.estrelaVermelha;
    }
    return this.estrelaBranca;
  });

  // Escoita o estado orixinal e os cambios de simulación en tempo real
  imagemAmosar = computed(() => {
    const dadosSM = this.simulandoPontuacom();

    if (dadosSM !== undefined) {
      return dadosSM.numero >= this.numero()
        ? this.estrelaVermelha
        : this.estrelaBranca;
    }

    // Se non se está simulando, volve á súa imaxe orixinal baseada no clic
    return this.imagemOriginal();
  });

  // Métodos de interacción do rato
  entrouORato() {
    if (this.isAllowedEnvironment() && this.numero() > -1) {
      this.simulacomEvent.emit({ numero: this.numero(), marcada: true });
    }
  }

  saiuORato() {
    if (this.isAllowedEnvironment()) {
      this.simulacomEvent.emit(undefined);
    }
  }

  ratoPicou() {
    if (this.isAllowedEnvironment()) {
      this.estavelecerPontuacomEvent.emit(this.numero());
    }
  }

  // Helper limpo para evitar repetir a condición do contorno
  private isAllowedEnvironment(): boolean {
    return environment.whereIAm === environments.dev || environment.whereIAm === environments.test;
  }
}
