export interface RelecturasData {
  data: ListadoRelecturas[];
  meta: {idLivro:number, quantidade:number};
}
export interface RelecturaData {
  data: Relectura[];
  meta: {id:number};
}

export interface Relectura {
  id: string;
  idLivro: string;
  titulo: string;

  idBiblioteca: number | null;
  biblioteca: string;
  idEditorial: number | null;
  editorial: string;
  idColecom: number | null;
  colecom: string;
  isbn: string | null;
  paginas: string | null;
  paginasLidas: string | null;
  lido: boolean;
  diasLeitura: string | null;
  dataFimLeitura: string;
  idIdioma: number | null;
  dataEdicom: string;
  numeroEdicom: string | null;
  electronico: boolean;
  somSerie: boolean;
  idSerie: number | null;
  comentario: string | null;
  pontuacom?: number;
}


export interface ListadoRelecturas {
  id: string;
  titulo: string;
  paginas: number;
  lido: boolean;
  dataFimLeitura: Date;
  diasLeitura: string | null;
  pontuacom?: number;
}
