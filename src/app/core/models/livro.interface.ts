import { Nacionalidade, Pais, Idioma, SerieLivro } from "../../shared/models/outros.model";
import { Biblioteca } from "./biblioteca.interface";
import { Colecom } from "./colecom.interface";
import { Editorial } from "./editorial.interface";
import { EstiloLiterario } from "./estilos-literarios.interface";
import { Genero } from "./genero.interface";

export interface LivroData {
  livro: Livro;
  meta: any;
}

export interface Livro {
  id: string;
  titulo: string;
  tituloOriginal: string | null;

  idBiblioteca: number | null;
  biblioteca: string;
  idEditorial: number | null;
  editorial: string;
  idColecom: number | null;
  colecom: string;
  idEstilo: number | null;
  estilo: string;
  isbn: string | null;
  paginas: string | null;
  paginasLidas: string | null;
  lido: boolean;
  diasLeitura: string | null;
  dataFimLeitura: string;
  idIdioma: number | null;
  idIdiomaOriginal: number | null;
  dataCriacom: string;
  dataEdicom: string;
  numeroEdicom: string | null;
  electronico: boolean
  somSerie: boolean;
  idSerie: number | null;
  premios: string | null;
  descricom: string | null;
  comentario: string | null;
  pontuacom?: number;
  autores: AutorSimple[];
  generos: Genero[];
}

export interface AutorSimple {
  id: number;
  nome: string;
}

export interface Autor {
  id: number;
  nome: string;
  nomeReal: string | null;
  lugarNacemento: string | null;
  dataNacemento: string;
  dataDefuncom: string;
  premios: string | null;
  web: string | null;
  comentario: string | null;
  idNacionalidade: number | null;
  nomeNacionalidade: string | null;
  idPais: number | null;
  nomePais: string | null;
  quantidade: number
}


export interface datasUltimosAnos {
  dataDoLivro: string;
  id: string;
}

export interface Outros {
  nacionalidades: { data: Nacionalidade[], meta: { quantidade:number } },
  paises: { data: Pais[], meta: { quantidade:number } },
  autores: { data: Autor[], meta: { quantidade:number } },
  bibliotecas: { data: Biblioteca[], meta: { quantidade:number } },
  editoriais: { data: Editorial[], meta: { quantidade:number } },
  generos: { data: Genero[], meta: { quantidade:number } },
  colecons: { data: Colecom[], meta: { quantidade:number } },
  estilos: { data: EstiloLiterario[], meta: { quantidade:number } },
  idiomas: { data: Idioma[], meta: { quantidade:number } },
  seriesLivro: { data: SerieLivro[], meta: { quantidade:number } }
  ultimaLeitura: string,
  ultimasLeituras: datasUltimosAnos[]
}
