import { BaseMeta } from "../../shared/models/base-dados";

export interface GraficosData {
  data: Graficos[];
  meta: BaseMeta;
}

export interface Graficos {
  id: number;     // Ano
  idioma: string;
  idIdioma: number;
  quantidadepaginas: number;
}
