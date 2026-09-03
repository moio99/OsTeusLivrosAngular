import { BaseElemento } from "../../shared/models/base-dados";

export interface Editorial extends BaseElemento {
  direicom: string | null,
  web: string | null,
  comentario: string | null,
}
