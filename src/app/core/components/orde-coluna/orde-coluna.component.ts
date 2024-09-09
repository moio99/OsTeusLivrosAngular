import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'omla-orde-coluna',
  standalone: true,
  templateUrl: './orde-coluna.component.html',
  styleUrls: ['./orde-coluna.component.scss']
})
export class OrdeColunaComponent implements OnInit {

  caracter = '';
  valorActual = '';
  valorInverso = false;

  @Input() abcd: string = '↓';
  @Input() dcba: string = '↑';
  @Input() nome: string = '';
  //@Input() actual: string = '';
  @Input('actual')
  set actual(data: string) {
    this.valorActual = data;
    this.amosarResultado();
  }
  @Input('inverso')
  set inverso(data: boolean) {
    this.valorInverso = data;
    this.amosarResultado();
  }

  constructor() { }

  ngOnInit(): void {
  }

  private amosarResultado() {
    if (this.valorActual === this.nome){
      if (this.valorInverso) {
        this.caracter = this.dcba;
      }
      else {
        this.caracter = this.abcd;
      }
    }
    else {
      this.caracter = '';
    }
  }
}
