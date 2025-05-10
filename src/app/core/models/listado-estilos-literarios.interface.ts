export interface ListadoEstilosLiterariosData {
  data: ListadoEstilosLiterarios[];
  meta: any;
}

export interface ListadoEstilosLiterarios {
  id: string;
  nome: string;
  quantidadeLivros: number;
  quantidadeLidos: number;
}
