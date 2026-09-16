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
export class DadosOutrosService {

  dadosOutrosCache: Outros | null = null;

  setDadosOutrosCache(data: object | null) {
    if (data)
      this.dadosOutrosCache = data as Outros;
  }

  getDadosOutrosCache() {
    return this.dadosOutrosCache;
  }

  /**
   * Comproba se existen datos de outros no usuario.
   * @returns {boolean} Verdadeiro se existen datos de outros, falso doutra maneira.
   */
  haDadosOutrosCache(): boolean {
    return !!this.dadosOutrosCache;
  }

  /**
   * Engade ou actualiza un autor, genero, biblioteca etc. nos datos do usuario.
   * Se já existe, actualiza o seu registro. Se nom existe, engade o novo registro.
   * @param dado autor, genero, biblioteca etc. a engadir ou actualizar
   * @param tipo tipo de dado, podendo ser Autor, Genero, Biblioteca, Editorial, Colecom ou EstiloLiterario
   */
  setElementoDadosOutrosCache(dado: Autor | Genero | Biblioteca | Editorial | Colecom | EstiloLiterario, tipo: DadosComplentarios) {
    if (!this.dadosOutrosCache) return;

    switch (tipo) {
      case DadosComplentarios.Autor: {
        const autorElemento = dado as Autor;
        const dataActual = this.dadosOutrosCache.autores?.data || [];
        const existe = dataActual.some(ele => ele.id === autorElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === autorElemento.id ? autorElemento : ele)
          : [...dataActual, autorElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          autores: {
            ...this.dadosOutrosCache.autores,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Genero: {
        const generoElemento = dado as Genero;
        const dataActual = this.dadosOutrosCache.generos?.data || [];
        const existe = dataActual.some(ele => ele.id === generoElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === generoElemento.id ? generoElemento : ele)
          : [...dataActual, generoElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          generos: {
            ...this.dadosOutrosCache.generos,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Biblioteca: {
        const bibliotecaElemento = dado as Biblioteca;
        const dataActual = this.dadosOutrosCache.bibliotecas?.data || [];
        const existe = dataActual.some(ele => ele.id === bibliotecaElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === bibliotecaElemento.id ? bibliotecaElemento : ele)
          : [...dataActual, bibliotecaElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          bibliotecas: {
            ...this.dadosOutrosCache.bibliotecas,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Editorial: {
        const editorialElemento = dado as Editorial;
        const dataActual = this.dadosOutrosCache.editoriais?.data || [];
        const existe = dataActual.some(ele => ele.id === editorialElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === editorialElemento.id ? editorialElemento : ele)
          : [...dataActual, editorialElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          editoriais: {
            ...this.dadosOutrosCache.editoriais,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.Colecom: {
        const colecomElemento = dado as Colecom;
        const dataActual = this.dadosOutrosCache.colecons?.data || [];
        const existe = dataActual.some(ele => ele.id === colecomElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === colecomElemento.id ? colecomElemento : ele)
          : [...dataActual, colecomElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          colecons: {
            ...this.dadosOutrosCache.colecons,
            data: novaData
          }
        };
        break;
      }
      case DadosComplentarios.EstiloLiterario: {
        const estiloLiterarioElemento = dado as EstiloLiterario;
        const dataActual = this.dadosOutrosCache.estilos?.data || [];
        const existe = dataActual.some(ele => ele.id === estiloLiterarioElemento.id);

        const novaData = existe
          ? dataActual.map(ele => ele.id === estiloLiterarioElemento.id ? estiloLiterarioElemento : ele)
          : [...dataActual, estiloLiterarioElemento];

        this.dadosOutrosCache = {
          ...this.dadosOutrosCache,
          estilos: {
            ...this.dadosOutrosCache.estilos,
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
  removerElementoDadosOutrosCache(id: string, tipo: DadosComplentarios) {
    switch (tipo) {
      case DadosComplentarios.Autor:
        if (!this.dadosOutrosCache?.autores?.data) return;

        this.dadosOutrosCache.autores.data = this.dadosOutrosCache.autores.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Genero:
        if (!this.dadosOutrosCache?.generos?.data) return;

        this.dadosOutrosCache.generos.data = this.dadosOutrosCache.generos.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Biblioteca:
        if (!this.dadosOutrosCache?.bibliotecas?.data) return;

        this.dadosOutrosCache.bibliotecas.data = this.dadosOutrosCache.bibliotecas.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Editorial:
        if (!this.dadosOutrosCache?.editoriais?.data) return;

        this.dadosOutrosCache.editoriais.data = this.dadosOutrosCache.editoriais.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.Colecom:
        if (!this.dadosOutrosCache?.colecons?.data) return;

        this.dadosOutrosCache.colecons.data = this.dadosOutrosCache.colecons.data.filter(
          ele => ele.id !== +id
        );
        break;
      case DadosComplentarios.EstiloLiterario:
        if (!this.dadosOutrosCache?.estilos?.data) return;

        this.dadosOutrosCache.estilos.data = this.dadosOutrosCache.estilos.data.filter(
          ele => ele.id !== +id
        );
        break;
    }
  }
}
