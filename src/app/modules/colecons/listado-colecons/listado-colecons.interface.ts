export interface ListadoColeconsData {
  data: ListadoColecons[];
  meta: any;
}

export interface ListadoColecons {
  id: number;
  nome: string;
  web: string;
  quantidadeLivros: number;
}
