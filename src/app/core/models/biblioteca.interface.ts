import { BaseElemento } from "./base-dados-api";

export interface Biblioteca extends BaseElemento {
  endereco: string | null,
  localidade: string | null,
  telefone: string | null,
  dataAsociamento: string;
  dataRenovacom: string;
  comentario: string | null,
}
