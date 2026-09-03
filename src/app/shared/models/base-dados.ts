
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
// Chamalo:   const listado: BaseListadoDadosApi<ListadoLivros>;

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
