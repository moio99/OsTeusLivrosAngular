import { DestroyRef, Injector, Service, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, merge, startWith } from 'rxjs';
import { Livro, LivroForm, ObjetoSimpleIdNome, Relectura } from '@interfaces';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { ConverterAData } from '../../../shared/classes/date-convert';
import { ValidaconsAMedida } from '../../../shared/validators/custom-validators';
import { environment, environments } from '../../../../environments/environment';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service({ autoProvided: false })
export class LivroFormStateService {
  private readonly fb = inject(FormBuilder);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly converterAData = new ConverterAData();

  readonly rex1000000 = '([1-1][0-0]{6,6}|[0-9]{1,6})';
  readonly rex1000 = '([1-1][0-0]{3,3}|[0-9]{1,3})';
  readonly disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;

  readonly livroForm = this.fb.group<LivroForm>({
    titulo: new FormControl({ value: '', disabled: this.disabledFormulario }, {
      validators: [Validators.required, Validators.maxLength(100)],
      updateOn: 'blur'
    }),
    tituloOriginal: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.maxLength(100)] }),
    idBiblioteca: new FormControl({ value: '', disabled: this.disabledFormulario }),
    idEditorial: new FormControl({ value: '', disabled: this.disabledFormulario }),
    idColecom: new FormControl({ value: '', disabled: this.disabledFormulario }),
    idEstilo: new FormControl({ value: '', disabled: this.disabledFormulario }),
    isbn: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.maxLength(20)] }),
    paginas: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.pattern(this.rex1000000)] }),
    paginasLidas: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.pattern(this.rex1000000)] }),
    lido: new FormControl({ value: false, disabled: this.disabledFormulario }),
    diasLeitura: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.pattern(this.rex1000)] }),
    dataFimLeiturata: new FormControl({ value: '', disabled: this.disabledFormulario }),
    idioma: new FormControl({ value: '', disabled: this.disabledFormulario }),
    idiomaOriginal: new FormControl({ value: '', disabled: this.disabledFormulario }),
    dataCriacom: new FormControl({ value: '', disabled: this.disabledFormulario }),
    dataEdicom: new FormControl({ value: '', disabled: this.disabledFormulario }),
    numeroEdicom: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.pattern(this.rex1000)] }),
    electronico: new FormControl({ value: false, disabled: this.disabledFormulario }),
    somSerie: new FormControl({ value: false, disabled: this.disabledFormulario }),
    serie: new FormControl({ value: '', disabled: this.disabledFormulario }),
    premios: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.maxLength(255)] }),
    descricom: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.maxLength(50000)] }),
    comentario: new FormControl({ value: '', disabled: this.disabledFormulario }, { validators: [Validators.maxLength(50000)] })
  }, { validators: [ValidaconsAMedida.comprobarDuasDatas('dataCriacom', 'dataEdicom')] });

  todasBibliotecasCombo = signal<SimpleObjet[]>([]);
  textoBibliotecaFiltro = toSignal(
    this.livroForm.controls.idBiblioteca.valueChanges.pipe(
      startWith(this.livroForm.controls.idBiblioteca.value ?? '')
    ),
    { initialValue: '' }
  );
  bibliotecasFiltradas = computed(() => {
    const texto = this.textoBibliotecaFiltro()?.toLowerCase();
    const todas = this.todasBibliotecasCombo();
    if (!texto) return todas;
    return todas.filter(item => item.value.toLowerCase().includes(texto));
  });

  todasEditoriaisCombo = signal<SimpleObjet[]>([]);
  textoEditorialFiltro = toSignal(
    this.livroForm.controls.idEditorial.valueChanges.pipe(
      startWith(this.livroForm.controls.idEditorial.value ?? '')
    ),
    { initialValue: '' }
  );
  editoriaisFiltradas = computed(() => {
    const texto = this.textoEditorialFiltro()?.toLowerCase();
    const todas = this.todasEditoriaisCombo();
    if (!texto) return todas;
    return todas.filter(item => item.value.toLowerCase().includes(texto));
  });

  todasColeconsCombo: SimpleObjet[] = [];
  colecons: Signal<SimpleObjet[]> = signal([]);
  todosEstilosCombo: SimpleObjet[] = [];
  estilos: Signal<SimpleObjet[]> = signal([]);
  todosIdiomasCombo: SimpleObjet[] = [];
  idiomas: Signal<SimpleObjet[]> = signal([]);
  idiomasOriginais: Signal<SimpleObjet[]> = signal([]);
  todasSeriesLivrosCombo: SimpleObjet[] = [];
  seriesLivro: Signal<SimpleObjet[]> = signal([]);
  todasBibliotecasCombo2: any;

  processarDadosCombo(
    data: ObjetoSimpleIdNome[] | undefined | null,
    control: FormControl<string | null>,
    ordenar = true
  ) {
    const elementosOrdenados = (data ?? [])
      .map(item => ({ id: item.id, value: item.nome }))
      .sort((a, b) => ordenar ? a.value.localeCompare(b.value) : 0);

    // Flujo de filtrado
    const fluxoFiltrado$ = merge(
      control.valueChanges.pipe(startWith(control.value || ''))
    ).pipe(
      map(() => this.filtroCombo(control.value || '', elementosOrdenados)),
      takeUntilDestroyed(this.destroyRef)
    );

    // Retorno a lista estática e o Signal reactivo cos dados já filtrados
    return {
      combo: elementosOrdenados,
      // toSignal encaréga-se de subscribirse e desubscribirse automaticamente
      signalFiltrado: toSignal(fluxoFiltrado$, {
        initialValue: elementosOrdenados,      // valores iniciais
        injector: this.injector   // necesario para o toSignal, porque non se pode acceder ao injector dentro do servicio
      })
    };
  }

  setDadosLivroForm(livro: Livro): void {
    this.livroForm.controls.titulo.setValue(livro.titulo);
    this.livroForm.controls.tituloOriginal.setValue(livro.tituloOriginal);
    this.setCombo(livro.idBiblioteca, this.todasBibliotecasCombo(), this.livroForm.controls.idBiblioteca);
    this.setCombo(livro.idEditorial, this.todasEditoriaisCombo(), this.livroForm.controls.idEditorial);
    this.setCombo(livro.idColecom, this.todasColeconsCombo, this.livroForm.controls.idColecom);
    this.setCombo(livro.idEstilo, this.todosEstilosCombo, this.livroForm.controls.idEstilo);
    this.livroForm.controls.isbn.setValue(livro.isbn);
    this.livroForm.controls.paginas.setValue(livro.paginas);
    this.livroForm.controls.paginasLidas.setValue(livro.paginasLidas);
    this.livroForm.controls.lido.setValue(livro.lido);
    this.livroForm.controls.diasLeitura.setValue(livro.diasLeitura);
    this.setData(livro.dataFimLeitura, this.livroForm.controls.dataFimLeiturata);
    this.setCombo(livro.idIdioma, this.todosIdiomasCombo, this.livroForm.controls.idioma);
    this.setCombo(livro.idIdiomaOriginal, this.todosIdiomasCombo, this.livroForm.controls.idiomaOriginal);
    this.livroForm.controls.numeroEdicom.setValue(livro.numeroEdicom);
    this.livroForm.controls.electronico.setValue(livro.electronico);
    this.setData(livro.dataCriacom, this.livroForm.controls.dataCriacom);
    this.setData(livro.dataEdicom, this.livroForm.controls.dataEdicom);
    this.livroForm.controls.somSerie.setValue(livro.somSerie);
    this.setCombo(livro.idSerie, this.todasSeriesLivrosCombo, this.livroForm.controls.serie);
    this.livroForm.controls.premios.setValue(livro.premios);
    this.livroForm.controls.descricom.setValue(livro.descricom);
    this.livroForm.controls.comentario.setValue(livro.comentario);
  }

  /**
   * Estavelece os dados no formulario
   */
  setDadosRelecturaForm(relectura: Relectura): void {
    if (relectura) {
      this.livroForm.controls.titulo.setValue(relectura.titulo);
      this.setCombo(relectura.idBiblioteca, this.todasBibliotecasCombo(), this.livroForm.controls.idBiblioteca);
      this.setCombo(relectura.idEditorial, this.todasEditoriaisCombo(), this.livroForm.controls.idEditorial);
      this.livroForm.controls.isbn.setValue(relectura.isbn);
      this.livroForm.controls.paginas.setValue(relectura.paginas);
      this.livroForm.controls.paginasLidas.setValue(relectura.paginasLidas);
      this.livroForm.controls.lido.setValue(relectura.lido);
      this.livroForm.controls.diasLeitura.setValue(relectura.diasLeitura);
      this.setData(relectura.dataFimLeitura, this.livroForm.controls.dataFimLeiturata);
      this.setCombo(relectura.idIdioma, this.todosIdiomasCombo, this.livroForm.controls.idioma);
      this.livroForm.controls.numeroEdicom.setValue(relectura.numeroEdicom);
      this.livroForm.controls.electronico.setValue(relectura.electronico);
      this.setData(relectura.dataEdicom, this.livroForm.controls.dataEdicom);
      this.livroForm.controls.somSerie.setValue(relectura.somSerie);
      this.setCombo(relectura.idSerie, this.todasSeriesLivrosCombo, this.livroForm.controls.serie);
      this.livroForm.controls.comentario.setValue(relectura.comentario);
    }
  }

  criarLivro(id: string, autores: SimpleObjet[], generos: SimpleObjet[], pontuacom?: number, autorAnonimo?: ObjetoSimpleIdNome): Livro {
    const autoresModelo: ObjetoSimpleIdNome[] = autores.map(autor => ({ id: autor.id, nome: autor.value }));
    if (autoresModelo.length === 0 && autorAnonimo) autoresModelo.push(autorAnonimo);
    const generosModelo = generos.map(genero => ({ id: genero.id, nome: genero.value }));
    const dFL = this.converterAData.getData(this.livroForm.controls.dataFimLeiturata.value);
    const dC = this.converterAData.getData(this.livroForm.controls.dataCriacom.value);
    const dE = this.converterAData.getData(this.livroForm.controls.dataEdicom.value);
    const biblioteca = this.findByValue(this.todasBibliotecasCombo(), this.livroForm.controls.idBiblioteca.value);
    const editorial = this.findByValue(this.todasEditoriaisCombo(), this.livroForm.controls.idEditorial.value);
    const colecom = this.findByValue(this.todasColeconsCombo, this.livroForm.controls.idColecom.value);
    const estilo = this.findByValue(this.todosEstilosCombo, this.livroForm.controls.idEstilo.value);
    const idioma = this.findByValue(this.todosIdiomasCombo, this.livroForm.controls.idioma.value);
    const idiomaOriginal = this.findByValue(this.todosIdiomasCombo, this.livroForm.controls.idiomaOriginal.value);
    const serie = this.findByValue(this.todasSeriesLivrosCombo, this.livroForm.controls.serie.value);
    const dateText = (date: { year: number; month: number; day: number }) => date.year > 0 ? `${date.year}-${date.month}-${date.day}` : '';

    const livro: Livro = {
      id, titulo: String(this.livroForm.controls.titulo.value), autores: autoresModelo,
      tituloOriginal: this.optionalText('tituloOriginal'), generos: generosModelo,
      idBiblioteca: biblioteca?.id ?? null, idEditorial: editorial?.id ?? null, idColecom: colecom?.id ?? null, idEstilo: estilo?.id ?? null,
      isbn: this.optionalText('isbn'), paginas: this.optionalText('paginas'), paginasLidas: this.optionalText('paginasLidas'),
      lido: this.livroForm.controls.lido.value ?? false, diasLeitura: this.optionalText('diasLeitura'), dataFimLeitura: dateText(dFL),
      idIdioma: idioma?.id ?? null, idIdiomaOriginal: idiomaOriginal?.id ?? null, dataCriacom: dateText(dC), dataEdicom: dateText(dE),
      numeroEdicom: this.optionalText('numeroEdicom'), electronico: this.livroForm.controls.electronico.value ?? false,
      somSerie: this.livroForm.controls.somSerie.value ?? false, idSerie: serie?.id ?? null,
      premios: this.optionalText('premios'), descricom: this.optionalText('descricom'), comentario: this.optionalText('comentario'), pontuacom,
      biblioteca: '', editorial: '', colecom: '', estilo: ''
    };
    return livro;
  }

  setCombo(id: number | null, combo: SimpleObjet[], control: FormControl): void {
    control.setValue(id == null ? null : combo.find(item => item.id === id)?.value ?? null);
  }

  setData(value: string, control: FormControl): void {
    const data = this.converterAData.getDataFromMySQL(value);
    if (data.year > 0) control.setValue(new Date(data.year, data.month - 1, data.day));
  }

  /**
  * Filtra os valores do despregável.
  * @param texto Filtro inserido polo usuario.
  * @param elementosOrdenados Listado cos elementos que se vai filtrar.
  */
  private filtroCombo(texto: string, elementosOrdenados: SimpleObjet[]): SimpleObjet[] {
    if (!texto || texto === '') {
      return elementosOrdenados;
    }
    const filterValue = texto.toLowerCase();
    return elementosOrdenados.filter(option => option.value.toLowerCase().includes(filterValue));
  }

  private findByValue(combo: SimpleObjet[], value: string | null): SimpleObjet | undefined {
    return combo.find(option => option.value === value);
  }

  private optionalText(control: keyof LivroForm): string | null {
    const value = this.livroForm.controls[control].value;
    return value ? String(value) : null;
  }
}
