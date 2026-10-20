import { BaseListado, BaseListadoDadosApi } from "../../shared/models/base-dados";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ListadoGenerosData extends Omit<BaseListadoDadosApi<ListadoGeneros>, 'id' | 'quantidade'> {
}

export interface ListadoGeneros extends BaseListado, BaseQuantidadesLivros {
}
