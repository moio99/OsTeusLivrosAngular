export interface ListadoEditoriaisData {
  data: ListadoEditoriais[];
  meta: any;
}

export interface ListadoEditoriais {
  id: number;
  nome: string;
  web: string;
  quantidadeLivros: number;
}
