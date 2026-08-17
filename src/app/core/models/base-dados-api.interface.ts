
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

export interface BaseQuantidadesLivros  {
  quantidadeLivros: number;
  quantidadeLidos: number;
}

export interface BaseComLivros extends Omit<BaseQuantidadesLivros, 'quantidadeLidos'> {
  // quantidadeLivros: number;   agora vem de BaseQuantidadesLivros
  web: string;
}

export interface BaseComLidos extends Omit<BaseQuantidadesLivros, 'quantidadeLivros'> {
  // quantidadeLidos: number;   agora vem de BaseQuantidadesLivros
  web: string;
}

export interface Resultado {
  idResult: string
}
