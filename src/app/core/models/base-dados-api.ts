export interface BaseDadosApi<T> {
  data: T[];
  meta: any;
}

export interface BaseElemento {
  id: number;
  nome: string;
}
