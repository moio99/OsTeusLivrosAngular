
export interface EstadisticasData {
  data: Estadisticas[];
  meta: any;
}

export interface Estadisticas {
  id: number;
  nome: string;
  quantidade: number;
  quantidadepaginas: number;
  quantidadeRelecturas: number;
  anos: number[];       // Enche-se no caso da consulta de generos cos anos nos que está ese genero
  generos: number[];    // Enche-se no caso da consulta de anos cos generos nos que está ese ano
}
