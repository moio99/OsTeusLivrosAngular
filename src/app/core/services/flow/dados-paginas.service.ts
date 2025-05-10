import { Injectable } from "@angular/core";
import { DadosComplentarios } from "../../../shared/enums/estadisticasTipos";
import { SimpleObjet } from "../../../shared/models/outros.model";

export interface DadosPagina {
  id: string;
  nomePagina: string;
  elemento: any;
}

export interface NovoDado {
  tipo: DadosComplentarios;
  elemento: any | SimpleObjet;
}

@Injectable({
  providedIn: 'root',
})
export class DadosPaginasService {

  private dados: DadosPagina[] = [];
  private novoDado: NovoDado | undefined;

  constructor() { }

  setDadosPagina(dado: DadosPagina) {
    let index = this.dados.findIndex(d => d.id === dado.id && d.nomePagina === dado.nomePagina);
    if (index > -1) {
      this.dados[index] = dado;
    }
    else {
      this.dados.push(dado);
    }
  }

  getDadosPagina(id: string, nomePagina: string): DadosPagina | undefined {
    if (this.dados.length === 0)
      return undefined;
    else {
      let atopado = this.dados.find(d => d.id === id && d.nomePagina === nomePagina);
      return atopado;
    }
  }

  setNovoDado(dado: NovoDado | undefined) {
    this.novoDado = dado;
  }

  getNovoDado(): NovoDado | undefined{
    return this.novoDado;
  }
}
