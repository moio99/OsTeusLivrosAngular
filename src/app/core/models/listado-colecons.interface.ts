import { BaseComLivros, BaseListadoDadosApi, BaseListado } from "./base-dados-api.interface";

export interface ListadoColeconsData extends BaseListadoDadosApi<ListadoColecons> {
}

export interface ListadoColecons extends BaseListado, BaseComLivros {
}
