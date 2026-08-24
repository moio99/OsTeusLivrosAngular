import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Autor, AutorForm } from '@interfaces';
import { ConverterAData } from '../../../shared/classes/date-convert';
import { ValidaconsAMedida } from '../../../shared/validators/custom-validators';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { startWith } from 'rxjs';

@Injectable()
export class AutorFormStateService {
  private readonly fb = inject(FormBuilder);
  private readonly converterAData = new ConverterAData();

  readonly autorForm = this.fb.group<AutorForm>({
    nome: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(150)],
      updateOn: 'blur'
    }),
    nomeReal: new FormControl('', { validators: [Validators.maxLength(150)] }),
    lugarNacemento: new FormControl('', { validators: [Validators.maxLength(150)] }),
    dataNacemento: new FormControl(null),
    dataDefuncom: new FormControl(null),
    premios: new FormControl(null),
    web: new FormControl('', { validators: [Validators.maxLength(100)] }),
    comentario: new FormControl(null),
    idNacionalidade: new FormControl(null),
    nomeNacionalidade: new FormControl(null),
    idPais: new FormControl(null),
    nomePais: new FormControl(null),
    quantidade: new FormControl(null)
  }, {
    validators: [ValidaconsAMedida.comprobarDuasDatas('dataNacemento', 'dataDefuncom')]
  });

  private readonly idNacionalidade = toSignal(this.autorForm.controls.idNacionalidade.valueChanges.pipe(startWith('')));
  private readonly idPais = toSignal(this.autorForm.controls.idPais.valueChanges.pipe(startWith('')));
  private readonly todasNacionalidades = signal<SimpleObjet[]>([]);
  private readonly todosPaises = signal<SimpleObjet[]>([]);

  readonly dadosNacionalidadesFiltradas = computed(() =>
    this.filtrar(this.todasNacionalidades(), this.idNacionalidade())
  );
  readonly dadosPaisesFiltrados = computed(() =>
    this.filtrar(this.todosPaises(), this.idPais())
  );

  setNacionalidades(opcoes: SimpleObjet[]): void {
    this.todasNacionalidades.set(opcoes);
  }

  setPaises(opcoes: SimpleObjet[]): void {
    this.todosPaises.set(opcoes);
  }

  amosarNacionalidade = (id: number | null): string =>
    this.todasNacionalidades().find(opcao => opcao.id === id)?.value ?? '';

  amosarPais = (id: number | null): string =>
    this.todosPaises().find(opcao => opcao.id === id)?.value ?? '';

  atualizarFromAutor(autor: Autor): void {
    this.autorForm.patchValue({
      nome: autor.nome,
      nomeReal: autor.nomeReal,
      lugarNacemento: autor.lugarNacemento,
      web: autor.web,
      comentario: autor.comentario,
      idNacionalidade: autor.idNacionalidade,
      idPais: autor.idPais,
      dataNacemento: this.dataFromMySql(autor.dataNacemento),
      dataDefuncom: this.dataFromMySql(autor.dataDefuncom)
    });
  }

  criarObjetoAutor(id: number | undefined): Autor {
    const dataNacemento = this.converterAData.getData(this.autorForm.controls.dataNacemento.value);
    const dataDefuncom = this.converterAData.getData(this.autorForm.controls.dataDefuncom.value);
    const nacionalidade = this.todasNacionalidades().find(opcao => opcao.id === this.autorForm.controls.idNacionalidade.value);
    const pais = this.todosPaises().find(opcao => opcao.id === this.autorForm.controls.idPais.value);

    return {
      id: Number(id),
      nome: this.textValue('nome'),
      nomeReal: this.optionalTextValue('nomeReal'),
      lugarNacemento: this.optionalTextValue('lugarNacemento'),
      dataNacemento: dataNacemento.year > 0 ? `${dataNacemento.year}-${dataNacemento.month}-${dataNacemento.day}` : '',
      dataDefuncom: dataDefuncom.year > 0 ? `${dataDefuncom.year}-${dataDefuncom.month}-${dataDefuncom.day}` : '',
      idNacionalidade: nacionalidade?.id ?? null,
      idPais: pais?.id ?? null,
      premios: this.optionalTextValue('premios'),
      web: this.optionalTextValue('web'),
      comentario: this.optionalTextValue('comentario'),
      nomeNacionalidade: '',
      nomePais: '',
      quantidade: 0
    };
  }

  private filtrar(opcoes: SimpleObjet[], valor: string | number | null | undefined): SimpleObjet[] {
    const texto = typeof valor === 'number' || !isNaN(Number(valor)) ? '' : String(valor ?? '').toLowerCase();
    return opcoes.filter(opcao => opcao.value.toLowerCase().includes(texto));
  }

  private dataFromMySql(value: string): Date | null {
    const data = this.converterAData.getDataFromMySQL(value);
    return data?.year > 0 ? new Date(data.year, data.month - 1, data.day) : null;
  }

  private textValue(control: keyof AutorForm): string {
    return String(this.autorForm.controls[control].value ?? '').trim();
  }

  private optionalTextValue(control: keyof AutorForm): string | null {
    const value = this.autorForm.controls[control].value;
    return value == null ? null : String(value).trim();
  }
}
