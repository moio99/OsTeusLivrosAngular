import { BaseListadoDadosApi, BaseListado } from "../../shared/models/base-dados";
import { BaseComLivros } from "./quantidades.interface";

export interface ListadoColeconsData extends BaseListadoDadosApi<ListadoColecons> {
}

export interface ListadoColecons extends BaseListado, BaseComLivros {
}
