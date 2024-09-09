export interface EditorialData {
  editorial: Editorial[];
  meta: {id:number, quantidade:number};
}

export interface Editorial {
  id: number;
  nome: string;
  direicom: string | null,
  web: string | null,
  comentario: string | null,
}
