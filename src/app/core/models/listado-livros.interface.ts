import { EstadisticasTipo } from "../../shared/enums/estadisticasTipos";

export interface Parametros {
  tipo: EstadisticasTipo;
  id: string;
}

export interface ListadoLivrosData {
  data: ListadoLivros[];
  meta: Meta;
}

export interface ListadoLivros {
  id: string;
  titulo: string;
  tituloOriginal: string;
  paginas: number;
  dataFimLeitura: Date;
  idioma: number;
  nomeIdioma: string;
  lido: boolean;
  idAutor: number;
  nomeAutor: string;
  autores: Autores[];
  quantidadeSerie: number;
  quantidadeRelecturas: number;
  idRelectura: string;
}

export interface Autores {
  id: string;
  nome: string;
}

export interface Meta {
  id: number;
  quantidade: number;
}
