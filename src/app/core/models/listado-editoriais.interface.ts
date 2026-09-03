import { BaseListado } from "../../shared/models/base-dados";
import { BaseComLivros } from "./quantidades.interface";

export interface ListadoEditoriaisData<T = any> {
  data: T[];
  meta: any;
}
// haberia que chamalo:   const listado: ListadoEditoriaisData<ListadoEditoriais>;

export interface ListadoEditoriais extends BaseListado, BaseComLivros {
}
