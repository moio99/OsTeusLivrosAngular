import { BaseListado } from "../../shared/models/base-dados";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ListadoEstilosLiterariosData<T = any> {
  data: T[];
  meta: any;
}
// haberia que chamalo:   const listado: ListadoEstilosLiterariosData<ListadoEstilosLiterarios>;

export interface ListadoEstilosLiterarios extends BaseListado, BaseQuantidadesLivros {
}
