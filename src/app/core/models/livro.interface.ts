import { FormControl } from "@angular/forms";
import { Nacionalidade, Pais, Idioma, SerieLivro } from "../../shared/models/outros.model";
import { Biblioteca } from "./biblioteca.interface";
import { Colecom } from "./colecom.interface";
import { Editorial } from "./editorial.interface";
import { EstiloLiterario } from "./estilos-literarios.interface";
import { Genero } from "./genero.interface";

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

export interface AutorForm {
  nome: FormControl<string | null>;
  nomeReal: FormControl<string | null>;
  lugarNacemento: FormControl<string | null>;
  dataNacemento: FormControl<Date | null>;
  dataDefuncom: FormControl<Date | null>;
  premios: FormControl<string | null>;
  web: FormControl<string | null>;
  comentario: FormControl<string | null>;
  idNacionalidade: FormControl<number | null>;
  nomeNacionalidade: FormControl<string | null>;
  idPais: FormControl<number | null>;
  nomePais: FormControl<string | null>;
  quantidade: FormControl<number | null>;
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
