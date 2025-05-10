import { BaseElemento } from "./base-dados-api";

export interface Editorial extends BaseElemento {
  direicom: string | null,
  web: string | null,
  comentario: string | null,
}
