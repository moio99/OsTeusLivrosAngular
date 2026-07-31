import { BaseComLivros, BaseListado } from "./base-dados-api.interface";

export interface ListadoEditoriaisData<T = any> {
  data: T[];
  meta: any;
}
// haberia que chamalo:   const listado: ListadoEditoriaisData<ListadoEditoriais>;

export interface ListadoEditoriais extends BaseListado, BaseComLivros {
}
