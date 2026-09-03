import { Injectable, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Autor } from '@interfaces';
import { ConverterAData } from '../../../shared/classes/date-convert';
import { ValidaconsAMedida } from '../../../shared/validators/custom-validators';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { form, disabled, required } from '@angular/forms/signals';
import { environment, environments } from '../../../../environments/environment';

@Injectable()
export class AutorFormStateService {
  private readonly converterAData = new ConverterAData();
  private readonly disabledFormulario =
    environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;

  readonly autorModel = signal({
    nome: '',
    nomeReal: '',
    lugarNacemento: '',
    dataNacemento: null as Date | null,
    dataDefuncom: null as Date | null,
    premios: '',
    web: '',
    comentario: '',
    idNacionalidade: 0,
    nomeNacionalidade: '',
    idPais: 0,
    nomePais: '',
    quantidade: 0
  });

  readonly autorForm = form(this.autorModel, (f) => {
    disabled(f.nome, { when: () => this.disabledFormulario });
    disabled(f.nomeReal, { when: () => this.disabledFormulario });
    disabled(f.lugarNacemento, { when: () => this.disabledFormulario });
    disabled(f.dataNacemento, { when: () => this.disabledFormulario });
    disabled(f.dataDefuncom, { when: () => this.disabledFormulario });
    disabled(f.premios, { when: () => this.disabledFormulario });
    disabled(f.web, { when: () => this.disabledFormulario });
    disabled(f.comentario, { when: () => this.disabledFormulario });
    disabled(f.idNacionalidade, { when: () => this.disabledFormulario });
    disabled(f.nomeNacionalidade, { when: () => this.disabledFormulario });
    disabled(f.idPais, { when: () => this.disabledFormulario });
    disabled(f.nomePais, { when: () => this.disabledFormulario });
    disabled(f.quantidade, { when: () => this.disabledFormulario });
    required(f.nome, { message: 'O nome é obrigatorio' });
    ValidaconsAMedida.maxLenNullable(f.nome, 150, 'nome');
    ValidaconsAMedida.maxLenNullable(f.nomeReal, 150, 'nome real');
    ValidaconsAMedida.maxLenNullable(f.lugarNacemento, 150, 'lugar de nacemento');
    ValidaconsAMedida.maxLenNullable(f.web, 100, 'web');
    ValidaconsAMedida.comprobarDuasDatasSignal(f.dataNacemento, f.dataDefuncom,
      'A data de defunçom nom pode ser anterior à data de nacemento'
    );
  });

  readonly todasNacionalidades = signal<SimpleObjet[]>([]);
  readonly todosPaises = signal<SimpleObjet[]>([]);

  setNacionalidades(opcoes: SimpleObjet[]): void {
    this.todasNacionalidades.set(opcoes);
  }

  setPaises(opcoes: SimpleObjet[]): void {
    this.todosPaises.set(opcoes);
  }

  seleccionarNacionalidade(idNacionalidade: number): void {
    const nacionalidadeSelecionada = this.todasNacionalidades().find(opcom => opcom.id === idNacionalidade) ?? null;

    this.autorModel.update(model => ({
      ...model,
      idNacionalidade: nacionalidadeSelecionada?.id ?? 0,
      nomeNacionalidade: nacionalidadeSelecionada?.value ?? ''
    }));
  }

  seleccionarPais(idPais: number): void {
    const paisSelecionado = this.todosPaises().find(opcom => opcom.id === idPais) ?? null;

    this.autorModel.update(model => ({
      ...model,
      idPais: paisSelecionado?.id ?? 0,
      nomePais: paisSelecionado?.value ?? ''
    }));
  }

  amosarNacionalidade = (id: number | null): string =>{
    const idNacionalidade = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : id;
    return this.todasNacionalidades().find(opcom => opcom.id === idNacionalidade)?.value ?? (typeof id === 'string' ? id : '');
  };

  amosarPais = (id: number | string | null): string => {
    return this.todosPaises().find(opcom => opcom.id === id)?.value ?? (typeof id === 'string' ? id : '');
  };

  nacionalidadesFiltradas = computed(() => {
    const textoBusca = this.autorModel().nomeNacionalidade.trim().toLowerCase();
    const listaCompleta = this.todasNacionalidades();

    if (!textoBusca) {
      return listaCompleta;
    }

    return listaCompleta.filter(nacionalidade =>
      nacionalidade.value.toLowerCase().includes(textoBusca)
    );
  });

  paisesFiltrados = computed(() => {
    const textoBusca = this.autorModel().nomePais.trim().toLowerCase();
    const listaCompleta = this.todosPaises();

    if (!textoBusca) {
      return listaCompleta;
    }

    return listaCompleta.filter(pais =>
      pais.value.toLowerCase().includes(textoBusca)
    );
  });

  atualizarFromAutor(autor: Autor): void {
    this.autorModel.set({
      nome: autor.nome,
      nomeReal: autor.nomeReal ?? '',
      lugarNacemento: autor.lugarNacemento ?? '',
      dataNacemento: this.dataFromMySql(autor.dataNacemento),
      dataDefuncom: this.dataFromMySql(autor.dataDefuncom),
      premios: autor.premios ?? '',
      web: autor.web ?? '',
      comentario: autor.comentario ?? '',
      idNacionalidade: autor.idNacionalidade ?? 0,
      nomeNacionalidade: autor.nomeNacionalidade ?? '',
      idPais: autor.idPais ?? 0,
      nomePais: autor.nomePais ?? '',
      quantidade: autor.quantidade
    });
  }

  criarObjetoAutor(id: number | undefined): Autor {
    const datosForm = this.autorModel();

    const dataNacemento = this.converterAData.getData(datosForm.dataNacemento);
    const dataDefuncom = this.converterAData.getData(datosForm.dataDefuncom);
    const nacionalidade = this.todasNacionalidades().find(opcom => opcom.id === datosForm.idNacionalidade);
    const pais = this.todosPaises().find(opcom => opcom.id === datosForm.idPais);

    return {
      id: Number(id),
      nome: datosForm.nome.trim(),
      nomeReal: datosForm.nomeReal?.trim() ?? null,
      lugarNacemento: datosForm.lugarNacemento?.trim() ?? null,
      dataNacemento: dataNacemento.year > 0 ? `${dataNacemento.year}-${dataNacemento.month}-${dataNacemento.day}` : '',
      dataDefuncom: dataDefuncom.year > 0 ? `${dataDefuncom.year}-${dataDefuncom.month}-${dataDefuncom.day}` : '',
      idNacionalidade: nacionalidade?.id ?? 0,
      idPais: pais?.id ?? 0,
      premios: datosForm.premios?.trim() ?? null,
      web: datosForm.web?.trim() ?? null,
      comentario: datosForm.comentario?.trim() ?? null,
      nomeNacionalidade: '',
      nomePais: '',
      quantidade: 0
    };
  }

  private dataFromMySql(value: string): Date | null {
    const data = this.converterAData.getDataFromMySQL(value);
    return data?.year > 0 ? new Date(data.year, data.month - 1, data.day) : null;
  }
}
