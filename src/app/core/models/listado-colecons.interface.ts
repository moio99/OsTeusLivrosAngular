export interface ListadoColeconsData {
  data: ListadoColecons[];
  meta: any;
}

export interface ListadoColecons {
  id: string;
  nome: string;
  web: string;
  quantidadeLivros: number;
}
