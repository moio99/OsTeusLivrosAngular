import { BaseDadosApi } from "./base-dados-api";

export interface ListadoColeconsData extends BaseDadosApi<ListadoColecons> {
}

export interface ListadoColecons {
  id: string;
  nome: string;
  web: string;
  quantidadeLivros: number;
}
