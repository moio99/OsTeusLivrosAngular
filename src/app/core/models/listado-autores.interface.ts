import { BaseListado, BaseElemento } from "@models";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ParametrosAutorListado {
  id: string;
  tipo: ListadoAutores;
}

export interface ListadoAutores extends BaseListado, BaseQuantidadesLivros {
}

export interface ListadoConcretoAutoresData {
  data: ListadoConcretoAutores[];
  meta: { quantidade: number };
}

export interface AutoresRetenidosData {
  data: number[];
  meta: { id: number; quantidade: number };
}

export interface ListadoConcretoAutores extends BaseElemento {
  quantidadeAutores: number;
}
