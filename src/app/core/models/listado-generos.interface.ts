export interface ListadoGenerosData {
  data: ListadoGeneros[];
  meta: any;
}

export interface ListadoGeneros {
  id: string;
  nome: string;
  quantidadeLivros: number;
  quantidadeLidos: number;
}
