import { FormControl } from "@angular/forms";
import { BaseElemento } from "../../shared/models/base-dados";

export interface EstiloLiterario extends BaseElemento {
  comentario?: string | null;
}

export interface EstiloLiterarioForm {
  nome: FormControl<string | null>;
  comentario:  FormControl<string | null>;
}
