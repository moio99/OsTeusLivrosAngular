import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Biblioteca, BibliotecaForm } from '@interfaces';
import { ConverterAData } from '../../../shared/classes/date-convert';

@Injectable()
export class BibliotecaFormStateService {
  private readonly fb = inject(FormBuilder);
  private readonly converterAData = new ConverterAData();

  readonly bibliotecaForm = this.fb.group<BibliotecaForm>({
    nome: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    endereco: new FormControl('', [Validators.maxLength(150)]),
    localidade: new FormControl('', [Validators.maxLength(100)]),
    telefone: new FormControl('', [Validators.maxLength(50)]),
    dataAsociamento: new FormControl(null),
    dataRenovacom: new FormControl(null),
    comentario: new FormControl('', Validators.maxLength(50000))
  });

  atualizarFromBiblioteca(biblioteca: Biblioteca): void {
    this.bibliotecaForm.patchValue({
      nome: biblioteca.nome,
      endereco: biblioteca.endereco,
      localidade: biblioteca.localidade,
      telefone: biblioteca.telefone,
      dataAsociamento: this.dataFromMySql(biblioteca.dataAsociamento),
      dataRenovacom: this.dataFromMySql(biblioteca.dataRenovacom),
      comentario: biblioteca.comentario
    });
  }

  criarObjetoBiblioteca(id: number | undefined): Biblioteca {
    let dateConvert = new ConverterAData();
    let dA = dateConvert.getData(this.bibliotecaForm.controls.dataAsociamento.value);
    let dR = dateConvert.getData(this.bibliotecaForm.controls.dataRenovacom.value);

    const biblioteca: Biblioteca = {
      id: Number(id),
      nome: String(this.bibliotecaForm.controls.nome.value),
      endereco: (this.bibliotecaForm.controls.endereco.value === null) ? null : String(this.bibliotecaForm.controls.endereco.value).trim(),
      localidade: (this.bibliotecaForm.controls.localidade.value === null) ? null : String(this.bibliotecaForm.controls.localidade.value).trim(),
      telefone: (this.bibliotecaForm.controls.telefone.value === null) ? null : String(this.bibliotecaForm.controls.telefone.value).trim(),
      dataAsociamento: (dA.year > 0) ? dA.year + '-' + dA.month + '-' + dA.day : '',
      dataRenovacom: (dR.year > 0) ? dR.year + '-' + dR.month + '-' + dR.day : '',
      comentario: (this.bibliotecaForm.controls.comentario.value === null) ? null : String(this.bibliotecaForm.controls.comentario.value).trim()
    };
    return biblioteca;
  }

  private dataFromMySql(value: string): Date | null {
    const data = this.converterAData.getDataFromMySQL(value);
    return data?.year > 0 ? new Date(data.year, data.month - 1, data.day) : null;
  }
}
