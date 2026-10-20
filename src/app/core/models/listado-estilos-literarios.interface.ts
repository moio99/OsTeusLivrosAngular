import { BaseListado, BaseListadoDadosApi } from "../../shared/models/base-dados";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ListadoEstilosLiterariosData extends Omit<BaseListadoDadosApi<ListadoEstilosLiterarios>, 'id' | 'quantidade'> {
}

export interface ListadoEstilosLiterarios extends BaseListado, BaseQuantidadesLivros {
}
