
export interface GraficosData {
  data: Graficos[];
  meta: any;
}

export interface Graficos {
  id: number;     // Ano
  idioma: string;
  idIdioma: number;
  quantidadePaginas: number;
}
