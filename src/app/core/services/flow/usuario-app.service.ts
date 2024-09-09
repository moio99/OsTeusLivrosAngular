import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class UsuarioAppService {

  constructor() { }

  setInformacom() {
    const userLang = navigator.language;

    // Lo uso para establecer el idioma del DatePicker.
    if (userLang === 'gl' || userLang === 'gl-ES' || userLang === 'es' || userLang === 'es-ES') {
      localStorage.setItem('UserLanguageDate', 'gl-ES');
    }
    else {
      localStorage.setItem('UserLanguageDate', navigator.language);
    }
  }
}
