import { Injectable } from "@angular/core";
import { Outros } from "../../models/livro.interface";
import { Genero } from "../../models/genero.interface";
import { DadosComplentarios } from "../../../shared/enums/estadisticasTipos";

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
   * Elimina um registro dum autor, genero, biblioteca etc. do usuario.
   * @param id Identificador do autor, genero, biblioteca etc. a eliminar
   * @param tipo Tipo de datos a eliminar
   */
  removerElementoDadosOutros(id: string, tipo: DadosComplentarios) {
    switch (tipo) {
      case DadosComplentarios.Autor:
        if (!this.dadosOutros?.autores?.data) return;

        this.dadosOutros.autores.data = this.dadosOutros.autores.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Genero:
        if (!this.dadosOutros?.generos?.data) return;

        this.dadosOutros.generos.data = this.dadosOutros.generos.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Biblioteca:
        if (!this.dadosOutros?.bibliotecas?.data) return;

        this.dadosOutros.bibliotecas.data = this.dadosOutros.bibliotecas.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Editorial:
        if (!this.dadosOutros?.editoriais?.data) return;

        this.dadosOutros.editoriais.data = this.dadosOutros.editoriais.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Colecom:
        if (!this.dadosOutros?.colecons?.data) return;

        this.dadosOutros.colecons.data = this.dadosOutros.colecons.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.EstiloLiterario:
        if (!this.dadosOutros?.estilos?.data) return;

        this.dadosOutros.estilos.data = this.dadosOutros.estilos.data.filter(
          ele => ele.id !== +id
        );
        break;
    }
  }
}
