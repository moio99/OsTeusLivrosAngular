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

export interface BibliotecaForm {
  nome: FormControl<string | null>;
  endereco: FormControl<string | null>;
  localidade: FormControl<string | null>;
  telefone: FormControl<string | null>;
  dataAsociamento: FormControl<Date | null>;
  dataRenovacom: FormControl<Date | null>;
  comentario: FormControl<string | null>;
}
