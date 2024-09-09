export interface GeneroData {
  genero: Genero[];
  meta: {id:number, quantidade:number};
}

export interface Genero {
  id: number;
  nome: string;
  comentario?: string | null;
}
