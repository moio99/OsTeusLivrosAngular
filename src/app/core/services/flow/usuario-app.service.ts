import { Service } from "@angular/core";
import { Outros } from "../../models/livro.interface";
import { Genero } from "../../models/genero.interface";
import { DadosComplentarios } from "../../../shared/enums/estadisticasTipos";
import { Autor, Biblioteca, Colecom, Editorial, EstiloLiterario } from "@interfaces";

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class UsuarioAppService {

  setInformacom() {
    const userLang = navigator.language;

    // Uso-o para estavelecer o idioma do DatePicker.
    if (userLang === 'gl' || userLang === 'gl-ES' || userLang === 'es' || userLang === 'es-ES') {
      localStorage.setItem('UserLanguageDate', 'gl-ES');
    }
    else {
      localStorage.setItem('UserLanguageDate', navigator.language);
    }
  }

}
