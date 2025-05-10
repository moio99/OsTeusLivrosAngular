import { BaseElemento } from "./base-dados-api";

export interface Colecom extends BaseElemento {
  isbn: string | null,
  web: string | null,
  comentario: string | null,
}
