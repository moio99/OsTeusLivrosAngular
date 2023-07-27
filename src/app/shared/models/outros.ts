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

export interface Autor {
  id: number;
  nome: string;
  comentario?: string;
}

export interface Biblioteca {
  id: number;
  nome: string;
  endereco?: string;
  localidade?: string;
  telefone?: string;
  dataAsociamento?: string;
  dataRenovacom?: string;
  comentario?: string;
}

export interface Editorial {
  id: number;
  nome: string;
  direicom?: string;
  web?: string;
  comentario?: string;
}

export interface Genero {
  id: number;
  nome: string;
  comentario?: string | null;
}

export interface Colecom {
  id: number;
  nome: string;
  ISBN?: string;
  web?: string;
  comentario?: string;
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
