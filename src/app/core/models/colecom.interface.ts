import { FormControl } from "@angular/forms";
import { BaseElemento } from "../../shared/models/base-dados";

export interface Colecom extends BaseElemento {
  isbn: string | null,
  web: string | null,
  comentario: string | null,
}

export interface ColecomForm {
  nome: FormControl<string | null>;
  isbn: FormControl<string | null>;
  web: FormControl<string | null>;
  comentario: FormControl<string | null>;
}
