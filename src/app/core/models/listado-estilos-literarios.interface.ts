import { BaseListado, BaseQuantidadesLivros } from "./base-dados-api.interface";

export interface ListadoEstilosLiterariosData<T = any> {
  data: T[];
  meta: any;
}
// haberia que chamalo:   const listado: ListadoEstilosLiterariosData<ListadoEstilosLiterarios>;

export interface ListadoEstilosLiterarios extends BaseListado, BaseQuantidadesLivros {
}
