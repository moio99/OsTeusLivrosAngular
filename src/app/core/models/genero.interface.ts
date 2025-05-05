import { BaseElemento } from "./base-dados-api";

export interface Genero extends BaseElemento {
  comentario?: string | null;
}
