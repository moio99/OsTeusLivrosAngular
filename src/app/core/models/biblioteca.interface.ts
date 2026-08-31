import { FormControl } from "@angular/forms";
import { BaseElemento } from "./base-dados-api.interface";

export interface Biblioteca extends BaseElemento {
  endereco: string,
  localidade: string,
  telefone: string,
  dataAsociamento: string;
  dataRenovacom: string;
  comentario: string,
}
