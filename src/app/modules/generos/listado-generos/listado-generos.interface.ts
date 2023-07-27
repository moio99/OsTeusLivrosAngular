export interface ListadoGenerosData {
  data: ListadoGeneros[];
  meta: any;
}

export interface ListadoGeneros {
  id: number;
  nome: string;
  quantidadeLivros: number;
  quantidadeLidos: number;
}
