import { Injectable } from "@angular/core";
import { Outros } from "../../models/livro.interface";
import { Genero } from "../../models/genero.interface";

@Injectable({
  providedIn: 'root',
})
export class UsuarioAppService {

  dadosOutros: Outros | null = null;

  constructor() {}

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

  setDadosOutros(data: object | null) {
    if (data)
      this.dadosOutros = data as Outros;
  }

  getDadosOutros() {
    return this.dadosOutros;
  }

  /**
   * Comproba se existen datos de outros no usuario.
   * @returns {boolean} Verdadeiro se existen datos de outros, falso doutra maneira.
   */
  haDadosOutros(): boolean {
    return !!this.dadosOutros;
  }

  /**
   * Engade ou actualiza un xenero nos datos do usuario.
   * Se o xenero xa existe, actualiza o seu rexistro. Se non existe, engade o novo rexistro.
   * Non modifica o estado do usuario se o xenero non se atopa entre os rexistros do usuario.
   * @param genero Xenero a engadir ou actualizar
   */
  setGenero(genero: Genero) {
    if (this.dadosOutros?.generos?.data) {
      const index = this.dadosOutros.generos.data.findIndex(ele => ele.id === genero.id);

      if (index !== -1) {
        // Actualizar o elemento existente (inmutável)
        this.dadosOutros.generos.data = [
          ...this.dadosOutros.generos.data.slice(0, index),
          genero,
          ...this.dadosOutros.generos.data.slice(index + 1)
        ];
      } else {
        // Engade o novo elemento (inmutável)
        this.dadosOutros.generos.data = [...this.dadosOutros.generos.data, genero];
      }
    }
  }

  /**
   * Elimina un rexistro dun xénero do usuario.
   * Non modifica o estado do usuario se o xénero non se atopa entre os rexistros do usuario.
   * @param id Identificador do xénero a eliminar
   */
  removerGenero(id: string) {
    if (!this.dadosOutros?.generos?.data || isNaN(+id)) return;

    this.dadosOutros.generos.data = this.dadosOutros.generos.data.filter(
      ele => ele.id !== +id
    );
  }
}
