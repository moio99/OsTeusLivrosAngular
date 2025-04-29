
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
}
