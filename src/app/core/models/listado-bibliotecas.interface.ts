import { BaseListado } from "../../shared/models/base-dados";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ListadoBibliotecasData<T = any> {
  data: T[];
  meta: any;
}
// haberia que chamalo:   const listado: ListadoBibliotecasData<ListadoBibliotecas>;

export interface ListadoBibliotecas extends BaseListado, Omit<BaseQuantidadesLivros, 'quantidadeLidos'> {
  dataRenovacom: string;
  // quantidadeLivros: number;    agora vem em BaseQuantidadesLivros
}
