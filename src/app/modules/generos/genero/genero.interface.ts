import { Genero } from "src/app/shared/models/outros";

export interface Parametros {
  id: number;
}

export interface GeneroData {
  genero: Genero[];
  meta: {id:number, quantidade:number};
}
