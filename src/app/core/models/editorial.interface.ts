import { FormControl } from "@angular/forms";
import { BaseElemento } from "../../shared/models/base-dados";


export interface Editorial extends BaseElemento {
  direicom: string | null,
  web: string | null,
  comentario: string | null,
}

export interface EditorialForm {
  nome: FormControl<string | null>;
  direicom:  FormControl<string | null>;
  web:  FormControl<string | null>;
  comentario:  FormControl<string | null>;
}
