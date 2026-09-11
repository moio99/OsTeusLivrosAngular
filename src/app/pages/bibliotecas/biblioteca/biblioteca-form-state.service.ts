import { Injectable, signal } from '@angular/core';
import { Biblioteca } from '@interfaces';
import { ConverterAData } from '../../../shared/classes/date-convert';
import { environment, environments } from '../../../../environments/environment';
import { disabled, form, required } from '@angular/forms/signals';
import { ValidaconsAMedida } from '../../../shared/validators/custom-validators';

@Injectable()
export class BibliotecaFormStateService {

  public readonly chamandoAPI = signal<boolean>(false);
  private readonly converterAData = new ConverterAData();
  private readonly disabledFormulario =
    environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;

  readonly bibliotecaModel = signal({
    nome: '',
    endereco: '',
    localidade: '',
    telefone: '',
    dataAsociamento: null as Date | null,
    dataRenovacom: null as Date | null,
    comentario: ''
  });

  readonly bibliotecaForm = form(this.bibliotecaModel, (f) => {
    disabled(f.nome, { when: () => this.disabledFormulario });
    disabled(f.endereco, { when: () => this.disabledFormulario });
    disabled(f.localidade, { when: () => this.disabledFormulario });
    disabled(f.telefone, { when: () => this.disabledFormulario });
    disabled(f.dataAsociamento, { when: () => this.disabledFormulario });
    disabled(f.dataRenovacom, { when: () => this.disabledFormulario });
    disabled(f.comentario, { when: () => this.disabledFormulario });
    required(f.nome, { message: 'O nome é obrigatorio' });
    ValidaconsAMedida.maxLenNullable(f.nome, 150, 'nome');
    ValidaconsAMedida.maxLenNullable(f.endereco, 150, 'endereço');
    ValidaconsAMedida.maxLenNullable(f.localidade, 100, 'localidade');
    ValidaconsAMedida.maxLenNullable(f.telefone, 50, 'telefone');
    ValidaconsAMedida.maxLenNullable(f.comentario, 50000, 'comentario');
  });

  atualizarFromBiblioteca(biblioteca: Biblioteca): void {
    this.bibliotecaModel.set({
      nome: biblioteca.nome,
      endereco: biblioteca.endereco ?? '',
      localidade: biblioteca.localidade  ?? '',
      telefone: biblioteca.telefone  ?? '',
      dataAsociamento: this.dataFromMySql(biblioteca.dataAsociamento),
      dataRenovacom: this.dataFromMySql(biblioteca.dataRenovacom),
      comentario: biblioteca.comentario ?? ''
    });
  }

  criarObjetoBiblioteca(id: number | undefined): Biblioteca {
    const datosForm = this.bibliotecaModel();

    let dateConvert = new ConverterAData();
    let dA = dateConvert.getData(datosForm.dataAsociamento);
    let dR = dateConvert.getData(datosForm.dataRenovacom);

    const biblioteca: Biblioteca = {
      id: Number(id),
      nome: datosForm.nome.trim(),
      endereco: datosForm.endereco?.trim() ?? null,
      localidade: datosForm.localidade?.trim() ?? null,
      telefone: datosForm.telefone?.trim() ?? null,
      dataAsociamento: (dA.year > 0) ? dA.year + '-' + dA.month + '-' + dA.day : '',
      dataRenovacom: (dR.year > 0) ? dR.year + '-' + dR.month + '-' + dR.day : '',
      comentario: datosForm.comentario?.trim() ?? null,
    };
    return biblioteca;
  }

  private dataFromMySql(value: string): Date | null {
    const data = this.converterAData.getDataFromMySQL(value);
    return data?.year > 0 ? new Date(data.year, data.month - 1, data.day) : null;
  }
}
