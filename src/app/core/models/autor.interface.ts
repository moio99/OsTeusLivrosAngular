import { FormControl } from "@angular/forms";
import { ListadosAutoresTipos } from "../../shared/enums/estadisticasTipos";
import { BaseListadoDadosApi } from "./base-dados-api.interface";

export interface Parametros {
  id: number;
  tipo: ListadosAutoresTipos;
}
// ou definida como un tipo:
// export type Parametros = {
//   id: number;
//   tipo: ListadosAutoresTipos;
// };
// As interfaces permiten facer declaration merging (podes definir a mesma interface dúas veces e TypeScript xunta as súas propiedades).
// Os tipos son pechados e non se poden duplicar unha vez definidos.

export interface AutorData<T> extends BaseListadoDadosApi<T> {
  meta: {id:number, quantidade:number};
}
// ou
// export type AutorData<T> = BaseListadoDadosApi<T> & {
//   meta: { id: number; quantidade: number };
// };
// o omit faise igual
// export type AutorData<T> = Omit<BaseListadoDadosApi<T>, 'propiedade'> & {
//   meta: { id: number; quantidade: number };
// };

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
