import { InformacomPeTipo } from "../enums/estadisticasTipos";

export interface SimpleObjet {
  id: number;
  value: string;
}

export interface DadosObtidos {
  data: Nacionalidade[];
  meta: {id:number, quantidade:number};
}

export interface Nacionalidade {
  id: number;
  nome: string;
  fkPais: number;
  nomePais: string;
  fkContinente: number;
  nomeContinente: string;
}

export interface Pais {
  id: number;
  nome: string;
  fkContinente: number;
  nomeContinente: string;
}

export interface Idioma {
  id: number;
  nome: string;
  codigo?: string;
}

export interface SerieLivro {
  id: number;
  titulo: string;
}

export interface InformacomPe {
  tipo: InformacomPeTipo;
  mensagem: string;
  duracom?: number;
}
