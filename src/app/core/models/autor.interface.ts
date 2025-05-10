import { ListadosAutoresTipos } from "../../shared/enums/estadisticasTipos";
import { BaseDadosApi } from "./base-dados-api";

export interface Parametros {
  id: number;
  tipo: ListadosAutoresTipos;
}

export interface AutorData<Autor> extends BaseDadosApi<Autor> {
  meta: {id:number, quantidade:number};
}

export interface Autor {
  id: number;
  nome: string;
  nomeReal: string | null;
  lugarNacemento: string | null;
  dataNacemento: string;
  dataDefuncom: string;
  premios: string | null;
  web: string | null;
  comentario: string | null;
  idNacionalidade: number | null;
  nomeNacionalidade: string | null;
  idPais: number | null;
  nomePais: string | null;
  quantidade: number
}
