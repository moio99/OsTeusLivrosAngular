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
