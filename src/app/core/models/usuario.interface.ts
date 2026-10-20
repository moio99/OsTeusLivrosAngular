import { BaseElemento, BaseListadoDadosApi } from "../../shared/models/base-dados";

export interface DadosLogueo {
  token: string;
  usuario: UsuarioLogado;
}

export interface UsuarioLogado {
  nome: string;
  id: number;
  idioma: number;
}

export interface Usuario {
  nome: string;
  contrasinal: string;
}

export interface UsuarioData<T> extends BaseListadoDadosApi<T> {
  // meta: {id:number, quantidade:number};
}

export interface AltaUsuario extends BaseElemento {
  pass: string | null,
  pergunta: string | null,
  contestacom: string | null,
  correio: string | null,
  idIdioma: number | null,
}
