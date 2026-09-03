import { ListadosAutoresTipos } from "../../shared/enums/estadisticasTipos";
import { BaseListadoDadosApi } from "../../shared/models/base-dados";

export interface ParametrosAutor {
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
  nomeReal: string;
  lugarNacemento: string;
  dataNacemento: string;
  dataDefuncom: string;
  premios: string;
  web: string;
  comentario: string;
  idNacionalidade: number;
  nomeNacionalidade: string;
  idPais: number;
  nomePais: string;
  quantidade: number
}
