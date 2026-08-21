import { LivroBase } from "./livro.interface";

export interface Relectura extends LivroBase {
  idLivro: string;
}

export interface RelecturasData {
  data: RelecturaListado[];
  meta: {idLivro:number, quantidade:number};
}
export interface RelecturaData {
  data: Relectura[];
  meta: {id:number};
}

export interface RelecturaListado {
  id: string;
  titulo: string;
  paginas: number;
  lido: boolean;
  dataFimLeitura: Date;
  diasLeitura: string | null;
  pontuacom?: number;
}
