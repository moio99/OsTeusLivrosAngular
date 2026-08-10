import { FormControl } from "@angular/forms";
import { Nacionalidade, Pais, Idioma, SerieLivro } from "../../shared/models/outros.model";
import { Biblioteca } from "./biblioteca.interface";
import { Colecom } from "./colecom.interface";
import { Editorial } from "./editorial.interface";
import { EstiloLiterario } from "./estilos-literarios.interface";
import { Genero } from "./genero.interface";
import { Autor } from "./autor.interface";

export interface LivroBase {
  id: string;
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

export interface Livro extends LivroBase {
  tituloOriginal: string | null;

  idEstilo: number | null;
  estilo: string;
  idIdiomaOriginal: number | null;
  dataCriacom: string;
  premios: string | null;
  descricom: string | null;
  autores: ObjetoSimpleIdNome[];
  generos: Genero[];
}

export interface LivroForm {
  titulo: FormControl<string | null>;
  tituloOriginal: FormControl<string | null>;
  idBiblioteca: FormControl<string | null>;
  idEditorial: FormControl<string | null>;
  idColecom: FormControl<string | null>;
  idEstilo: FormControl<string | null>;
  isbn: FormControl<string | null>;
  paginas: FormControl<string | null>;
  paginasLidas: FormControl<string | null>;
  lido: FormControl<boolean | null>;
  diasLeitura: FormControl<string | null>;
  dataFimLeiturata: FormControl<string | null>;
  idioma: FormControl<string | null>;
  idiomaOriginal: FormControl<string | null>;
  dataCriacom: FormControl<string | null>;
  dataEdicom: FormControl<string | null>;
  numeroEdicom: FormControl<string | null>;
  electronico: FormControl<boolean | null>;
  somSerie: FormControl<boolean | null>;
  serie: FormControl<string | null>;
  premios: FormControl<string | null>;
  descricom: FormControl<string | null>;
  comentario: FormControl<string | null>;
}

export interface ObjetoSimpleIdNome {
  id: number;
  nome: string;
}

export interface datasUltimosAnos {
  id: string;
  dataDoLivro: string;
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
