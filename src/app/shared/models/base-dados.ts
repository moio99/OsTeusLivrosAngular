
export interface ParametrosId {
  id: string;
}

export interface Parametros extends ParametrosId {
  idRelectura: string;
}

export interface BaseListadoDadosApi<T> {
  data: T[];
  meta: any;
}
// Para chama-lo:   const listado: BaseListadoDadosApi<ListadoLivros>;

export interface BaseElemento {
  id: number;
  nome: string;
}

export interface BaseListado {
  id: string;
  nome: string;
}

export interface Resultado {
  idResult: string
}

export interface ResultadoNumber {
  idResult: number
}

export interface ResultadoMeta extends ResultadoNumber {
  meta: ParametrosId
}
