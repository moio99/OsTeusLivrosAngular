import { FormControl } from "@angular/forms";
import { BaseElemento } from "../../shared/models/base-dados";

export interface Genero extends BaseElemento {
  tipo?: 'propriedade para saver que o tipo é Género';
  comentario?: string | null;
}

export interface GeneroForm {
  nome: FormControl<string | null>;
  comentario: FormControl<string | null>;
}
