import { BaseListado, BaseListadoDadosApi } from "../../shared/models/base-dados";
import { BaseComLivros } from "./quantidades.interface";

export interface ListadoEditoriaisData extends Omit<BaseListadoDadosApi<ListadoEditoriais>, 'id' | 'quantidade'> {
}

export interface ListadoEditoriais extends BaseListado, BaseComLivros {
}
