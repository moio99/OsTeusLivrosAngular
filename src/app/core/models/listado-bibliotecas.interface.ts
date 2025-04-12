export interface ListadoBibliotecasData {
  data: ListadoBibliotecas[];
  meta: any;
}

export interface ListadoBibliotecas {
  id: string;
  nome: string;
  dataRenovacom: string;
  quantidadeLivros: number;
}
