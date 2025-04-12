export interface ColecomData {
  colecom: Colecom[];
  meta: {id:number, quantidade:number};
}

export interface Colecom {
  id: number;
  nome: string;
  isbn: string | null,
  web: string | null,
  comentario: string | null,
}
