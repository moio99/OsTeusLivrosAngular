import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Estrela } from './estrelas-pontuacom.interface';
import { EstrelaComponent } from './estrela/estrela.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'omla-estrelas-pontuacom',
  standalone: true,
  imports: [ CommonModule, EstrelaComponent ],
  templateUrl: './estrelas-pontuacom.component.html',
  styleUrls: ['./estrelas-pontuacom.component.scss']
})
export class EstrelasPontuacomComponent implements OnInit {

  cantidade: number = 10;
  estrelas: Estrela[] = [];
  estrelaSimulando?: Estrela = undefined;
  novaPontuacom?: number = undefined;

  //@Input() pontuacom: number | undefined;
  @Input('pontuacom')
  set pontuacom(data: number | undefined) {
    this.novaPontuacom = data;
    this.numeroActual = data ? data : 0;
  }
  @Output() public numero = new EventEmitter<number | undefined>();

  numeroActual = 0;

  constructor() { }

  ngOnInit(): void {
    for(let i = 1; i < this.cantidade + 1; i++){
      let estrela = { numero: i, marcada: (this.pontuacom != undefined && i <= this.pontuacom) };
      this.estrelas.push(estrela);
      if (i < this.cantidade) {
        let estrelaMedia = { numero: i + 0.5, marcada: (this.pontuacom != undefined && i <= this.pontuacom) };
        this.estrelas.push(estrelaMedia);
      }
    }
    /* for(let i = 1; i < this.cantidade; i++){
      let estrela = { numero: i + 0.5, marcada: (this.pontuacom != undefined && i <= this.pontuacom) };
      this.estrelasMedias.push(estrela);
    } */
    this.novaPontuacom = this.pontuacom;
    this.numeroActual = (this.pontuacom != undefined) ? this.pontuacom : 0;
  }

  onSimulacom(estrelaDados: Estrela | undefined) {
    this.estrelaSimulando = estrelaDados;
    if (estrelaDados != undefined)
      this.numeroActual = estrelaDados.numero;
    else {
      if (this.novaPontuacom)
        this.numeroActual = this.novaPontuacom;
    }
  }

  onEstavelecerPontuacom(numero: any) {
    this.pontuacom = numero;
    this.estrelas.forEach(estrela => {
      estrela.marcada = (estrela.numero <= numero);
    });
    this.novaPontuacom = numero;

    this.numero.emit(numero);
  }
}
