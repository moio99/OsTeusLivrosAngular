import { BaseElemento } from "../../shared/models/base-dados";

export interface Biblioteca extends BaseElemento {
  endereco: string,
  localidade: string,
  telefone: string,
  dataAsociamento: string;
  dataRenovacom: string;
  comentario: string,
}
