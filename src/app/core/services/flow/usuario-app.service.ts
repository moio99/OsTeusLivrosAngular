import { Injectable } from "@angular/core";
import { Outros } from "../../models/livro.interface";
import { Genero } from "../../models/genero.interface";
import { DadosComplentarios } from "../../../shared/enums/estadisticasTipos";
import { Autor, Biblioteca, Colecom, Editorial, EstiloLiterario } from "@interfaces";

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
   * Engade ou actualiza un autor, genero, biblioteca etc. nos datos do usuario.
   * Se já existe, actualiza o seu registro. Se nom existe, engade o novo registro.
   * @param dado autor, genero, biblioteca etc. a engadir ou actualizar
   * @param tipo tipo de dado, podendo ser Autor, Genero, Biblioteca, Editorial, Colecom ou EstiloLiterario
   */
  setElementoDadosOutros(dado: Autor | Genero | Biblioteca | Editorial | Colecom | EstiloLiterario, tipo: DadosComplentarios) {
    if (!this.dadosOutros) return;

    switch (tipo) {
      case DadosComplentarios.Autor: {
        const autorElemento = dado as Autor;
        const dataActual = this.dadosOutros.autores?.data || [];
        const existe = dataActual.some(ele => ele.id === autorElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === autorElemento.id ? autorElemento : ele)
          : [...dataActual, autorElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          autores: {
            ...this.dadosOutros.autores,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Genero: {
        const generoElemento = dado as Genero;
        const dataActual = this.dadosOutros.generos?.data || [];
        const existe = dataActual.some(ele => ele.id === generoElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === generoElemento.id ? generoElemento : ele)
          : [...dataActual, generoElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          generos: {
            ...this.dadosOutros.generos,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Biblioteca: {
        const bibliotecaElemento = dado as Biblioteca;
        const dataActual = this.dadosOutros.bibliotecas?.data || [];
        const existe = dataActual.some(ele => ele.id === bibliotecaElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === bibliotecaElemento.id ? bibliotecaElemento : ele)
          : [...dataActual, bibliotecaElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          bibliotecas: {
            ...this.dadosOutros.bibliotecas,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Editorial: {
        const editorialElemento = dado as Editorial;
        const dataActual = this.dadosOutros.editoriais?.data || [];
        const existe = dataActual.some(ele => ele.id === editorialElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === editorialElemento.id ? editorialElemento : ele)
          : [...dataActual, editorialElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          editoriais: {
            ...this.dadosOutros.editoriais,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Colecom: {
        const colecomElemento = dado as Colecom;
        const dataActual = this.dadosOutros.colecons?.data || [];
        const existe = dataActual.some(ele => ele.id === colecomElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === colecomElemento.id ? colecomElemento : ele)
          : [...dataActual, colecomElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          colecons: {
            ...this.dadosOutros.colecons,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.EstiloLiterario: {
        const estiloLiterarioElemento = dado as EstiloLiterario;
        const dataActual = this.dadosOutros.estilos?.data || [];
        const existe = dataActual.some(ele => ele.id === estiloLiterarioElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === estiloLiterarioElemento.id ? estiloLiterarioElemento : ele)
          : [...dataActual, estiloLiterarioElemento];

        this.dadosOutros = {
          ...this.dadosOutros,
          estilos: {
            ...this.dadosOutros.estilos,
            data: novaData
          }
        };
        break;
      }
    }
  }

  /**
   * Elimina um registro dum autor, genero, biblioteca etc. do usuario.
   * @param id Identificador do autor, genero, biblioteca etc. a eliminar
   * @param tipo tipo de dado, podendo ser Autor, Genero, Biblioteca, Editorial, Colecom ou EstiloLiterario
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
