import { BaseElemento } from "./base-dados-api";

export interface Genero extends BaseElemento {
  tipo?: 'propriedade para saver que o tipo é Género';
  comentario?: string | null;
}
