export interface ListadoEditoriaisData {
  data: ListadoEditoriais[];
  meta: any;
}

export interface ListadoEditoriais {
  id: string;
  nome: string;
  web: string;
  quantidadeLivros: number;
}
