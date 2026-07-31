import { BaseElemento } from "./base-dados-api.interface";

export interface Colecom extends BaseElemento {
  isbn: string | null,
  web: string | null,
  comentario: string | null,
}
