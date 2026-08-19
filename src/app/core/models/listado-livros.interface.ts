import { EstadisticasTipo } from "../../shared/enums/estadisticasTipos";

export interface ParametrosLivroListado {
  id: string;
  tipo: EstadisticasTipo;
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
