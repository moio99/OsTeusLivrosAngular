import { BaseElemento } from "./base-dados-api.interface";

export interface Genero extends BaseElemento {
  tipo?: 'propriedade para saver que o tipo é Género';
  comentario?: string | null;
}
