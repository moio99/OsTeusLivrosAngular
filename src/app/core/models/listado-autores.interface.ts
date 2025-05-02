import { ListadosAutoresTipos } from "../../shared/enums/estadisticasTipos";

export interface Parametros {
  id: string;
  tipo: ListadosAutoresTipos;
}

export interface ListadoAutoresData {
  data: ListadoAutores[];
  meta: any;
}

export interface ListadoAutores {
  id: string;
  nome: string;
  quantidadeLivros: number;
  quantidadeLidos: number;
}

export interface ListadoConcretoAutoresData {
  data: ListadoConcretoAutores[];
  meta: any;
}

export interface ListadoConcretoAutores {
  id: number;
  nome: string;
  quantidadeAutores: number;
}
