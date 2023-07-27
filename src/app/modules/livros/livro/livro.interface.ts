import { Biblioteca, Colecom, Editorial, Genero, Idioma, Nacionalidade, Pais, SerieLivro, SimpleObjet } from "src/app/shared/models/outros";

export interface Parametros {
  id: number;
}

export interface LivroData {
  livro: Livro;
  meta: any;
}

export interface Livro {
  id: number;
  titulo: string;
  tituloOriginal: string | null,

  idBiblioteca: number | null,
  biblioteca: string;
  idEditorial: number | null,
  editorial: string;
  idColecom: number | null,
  colecom: string;
  isbn: string | null,
  paginas: string | null,
  paginasLidas: string | null,
  lido: boolean,
  diasLeitura: string | null,
  dataFimLeitura: string,
  idIdioma: number | null,
  idIdiomaOriginal: number | null,
  dataCriacom: string,
  dataEdicom: string,
  numeroEdicom: string | null,
  electronico: boolean
  somSerie: boolean;
  idSerie: number | null,
  premios: string | null,
  descricom: string | null,
  comentario: string | null,
  pontuacom?: number;
  autores: Autor[];
  generos: Genero[];
}

export interface Autor {
  id: number;
  nome: string;
}

export interface Outros {
  nacionalidades: { data: Nacionalidade[], meta: { quantidade:number } },
  paises: { data: Pais[], meta: { quantidade:number } },
  autores: { data: Autor[], meta: { quantidade:number } },
  bibliotecas: { data: Biblioteca[], meta: { quantidade:number } },
  editoriais: { data: Editorial[], meta: { quantidade:number } },
  generos: { data: Genero[], meta: { quantidade:number } },
  colecons: { data: Colecom[], meta: { quantidade:number } },
  idiomas: { data: Idioma[], meta: { quantidade:number } },
  seriesLivro: { data: SerieLivro[], meta: { quantidade:number } }
  ultimaLeitura: string
}
