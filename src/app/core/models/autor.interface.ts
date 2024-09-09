import { ListadosAutoresTipos } from "../../shared/enums/estadisticasTipos";

export interface Parametros {
  id: number;
  tipo: ListadosAutoresTipos;
}

export interface AutorData {
  autor: Autor[];
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
