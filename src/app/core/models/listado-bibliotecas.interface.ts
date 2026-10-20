import { BaseListado, BaseListadoDadosApi } from "../../shared/models/base-dados";
import { BaseQuantidadesLivros } from "./quantidades.interface";

export interface ListadoBibliotecasData extends Omit<BaseListadoDadosApi<ListadoBibliotecas>, 'id' | 'quantidade'> {
}

export interface ListadoBibliotecas extends BaseListado, Omit<BaseQuantidadesLivros, 'quantidadeLidos'> {
  dataRenovacom: string;
  // quantidadeLivros: number;    agora vem em BaseQuantidadesLivros
}
