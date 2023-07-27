export interface ListadoBibliotecasData {
  data: ListadoBibliotecas[];
  meta: any;
}

export interface ListadoBibliotecas {
  id: number;
  nome: string;
  dataRenovacom: string;
  quantidadeLivros: number;
}
