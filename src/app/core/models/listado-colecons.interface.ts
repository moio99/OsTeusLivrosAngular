import { BaseListadoDadosApi, BaseListado } from "../../shared/models/base-dados";
import { BaseComLivros } from "./quantidades.interface";

export interface ListadoColeconsData extends Omit<BaseListadoDadosApi<ListadoColecons>, 'id' | 'quantidade'> {
}

export interface ListadoColecons extends BaseListado, BaseComLivros {
}
