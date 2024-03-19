import { EstadisticasTipo } from "src/app/shared/enums/estadisticasTipos";

export interface Parametros {
  tipo: EstadisticasTipo;
  id: number;
}

export interface ListadoLivrosData {
  data: ListadoLivros[];
  meta: Meta;
}

export interface ListadoLivros {
  id: number;
  titulo: string;
  tituloOriginal: string;
  paginas: number;
  dataFimLeitura: Date;
  lido: boolean;
  idAutor: number;
  nomeAutor: string;
  autores: Autores[];
  quantidadeSerie: number;
  quantidadeRelecturas: number;
}

export interface Autores {
  id: number;
  nome: string;
}

export interface Meta {
  id: number;
  quantidade: number;
}
