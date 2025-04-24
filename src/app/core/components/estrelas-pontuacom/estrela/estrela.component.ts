import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Estrela } from '../estrelas-pontuacom.interface';
import { CommonModule } from '@angular/common';
import { environment, environments } from '../../../../../environments/environment';

@Component({
  selector: 'omla-estrela',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './estrela.component.html',
  styleUrls: ['./estrela.component.scss']
})
export class EstrelaComponent implements OnInit {

  estrelaBranca: String = '/assets/images/estrela01.gif';
  estrelaVermelha: String = '/assets/images/estrela02.gif';
  imagemOriginal = this.estrelaBranca;
  imagemSimulacom = this.estrelaVermelha;
  imagemAmosar = this.estrelaBranca;
  @Input() numero: number = -1;
  @Input() set simulandoPontuacom(dadosSM: Estrela | undefined){
    if (dadosSM != undefined) {
      if (dadosSM.numero >= this.numero)
          this.imagemAmosar = this.estrelaVermelha;
        else
          this.imagemAmosar = this.estrelaBranca;
    }
    else
      this.imagemAmosar = this.imagemOriginal;
  }
  @Input() set estavelecerNonovaPontuacom(novoNumero: number | undefined) {
    if (novoNumero != undefined && this.numero <= novoNumero)
      this.imagemOriginal = this.estrelaVermelha;
    else
      this.imagemOriginal = this.estrelaBranca;
    this.imagemAmosar = this.imagemOriginal;
  }
  @Output() public simulacomEvent = new EventEmitter<Estrela>();
  @Output() public estavelecerPontuacomEvent = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  entrouORato() {
    if (environment.whereIAm === environments.dev || environment.whereIAm === environments.test) {
      if (this.numero > -1)
        this.simulacomEvent.emit({numero: this.numero, marcada: true});
    }
  }

  saiuORato() {
    if (environment.whereIAm === environments.dev || environment.whereIAm === environments.test)
      this.simulacomEvent.emit(undefined);
  }

  ratoPicou() {
    if (environment.whereIAm === environments.dev || environment.whereIAm === environments.test)
      this.estavelecerPontuacomEvent.emit(this.numero);
  }
}
