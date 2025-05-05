import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';
import { environment, environments } from '../../../../../environments/environment';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../services/flow/layout.service';
import { EstadosPagina } from '../../../../shared/enums/estadosPagina';
import { FormGroup } from '@angular/forms';
import { BaseDadosApi, BaseElemento } from '../../../models/base-dados-api';
import { BaseApiService } from '../../../services/api/base-api.service.ts';
import { DadosPaginasService } from '../../../services/flow/dados-paginas.service';
import { ParametrosId } from '../../../models/comun.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../models/listado-livros.interface';
import { Genero } from '../../../models/genero.interface';
import { UsuarioAppService } from '../../../services/flow/usuario-app.service';
import { SimpleObjet } from '../../../../shared/models/outros.model';

@Component({
  template: ''
})
export abstract class BaseElementoComponent<TElemento extends BaseElemento, TServico extends BaseApiService<TElemento>>
    implements OnInit {

  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  estadosPagina = EstadosPagina;
  modo: EstadosPagina = EstadosPagina.engadir;
  protected elementoId: string | null = null;
  protected dadosDoElemento: TElemento | undefined;
  protected livrosDoElemento: ListadoLivros[] = [];

  protected abstract get formuario(): FormGroup;
  protected abstract serviceGetLivros(id: string): any;
  protected abstract getNomeElemento(): string;
  protected abstract getErrorMessage(context: string): string;
  protected abstract getLivrosErrorMessage(): string;

  protected abstract updateFormValues(eleemnto: TElemento): void;
  protected abstract createElementoForm(): TElemento;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected layoutService: LayoutService,
    protected location: Location,
    protected dadosPaginasService: DadosPaginasService,
    protected usuarioAppService: UsuarioAppService,
    @Inject('MyServiceToken') protected servicoElemento: TServico
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametros = params as ParametrosId;
      this.elementoId = parametros.id;

      if (parametros.id === '0') {
        this.modo = EstadosPagina.engadir;
      } else {
        this.modo = EstadosPagina.guardar;
        this.obterDadosDoElemento(parametros.id);
      }

      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
        this.modo = EstadosPagina.soVisualizar;
      }
    });
  }

  onSubmit(event: SubmitEvent) {
    if (this.isFormValid()) {
      this.checkForDuplicates(event);
    }
  }

  onCancelar() {
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  onIrPagina(rota: string, id: string, idRelectura: string = '0'): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);

    const relectura = idRelectura != '0' ? `&idRelectura=${idRelectura}` : '';
    const rotaCompleta = `${rota}?id=${id}${relectura}`;

    this.router.navigateByUrl(rotaCompleta);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  protected obterDadosDoElemento(id: string): void {
    this.servicoElemento.getPorId(id)
      .pipe(first())
      .subscribe({
        next: (v: any) => {
          this.dadosDoElemento = this.dadosObtidos(v);
          if (this.dadosDoElemento) {
            this.updateFormValues(this.dadosDoElemento);
          }
        },
        error: (e: any) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.getErrorMessage('obtención')
          });
        },
        complete: () => this.obterLivros(id)
      });
  }

  protected dadosObtidos(data: any): TElemento | undefined {
    const dados = data as BaseDadosApi<TElemento>;
    if (dados?.data?.length > 0) {
      return dados.data[0];
    } else {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Erro,
        mensagem: this.getErrorMessage('datos')
      });
      return undefined;
    }
  }

  protected obterLivros(id: string): void {
    console.debug(`completada a obtençom dos dados da entidade ${id}`);
    this.serviceGetLivros(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.livrosDoElemento = this.dadosLivrosObtidos(v),
        error: (e: any) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: this.getLivrosErrorMessage()
          });
        },
        complete: () => console.debug('completada a obtençom dos livros')
      });
  }

  protected dadosLivrosObtidos(data: object): any[] {
    const dados = data as ListadoLivrosData;
    return dados?.data ?? [];
  }

  protected isFormValid(): boolean {
    return Object.values(this.formuario.controls).every(control => control.status === 'VALID');
  }

  protected checkForDuplicates(event: SubmitEvent) {
    const nameValue = String(this.formuario.get('nome')?.value).trim();

    this.servicoElemento.getPorNome(nameValue)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.handleDuplicateCheck(event, v as BaseDadosApi<TElemento>),
        error: (e: any) => this.handleError('obtención', e),
        complete: () => {}
      });
  }

  protected handleDuplicateCheck(event: SubmitEvent, elementoExistente: BaseDadosApi<TElemento>) {
    const isDuplicate = elementoExistente?.meta?.quantidade > 0 &&
      (this.isAdding(event) ||
       (!this.isAdding(event) && elementoExistente.meta.id !== (this.dadosDoElemento as any)?.id));

    if (isDuplicate) {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Aviso,
        mensagem: `O nome ${this.getNomeElemento()} já existe na base de dados`
      });
    } else {
      this.saveElemento(event);
    }
  }

  private saveElemento(event: SubmitEvent) {
    const elemento = this.createElementoForm();

    const serviceCall = this.isAdding(event)
      ? this.servicoElemento.create(elemento)
      : this.servicoElemento.update(elemento);

    serviceCall.pipe(first()).subscribe({
      next: (v: any) => this.handleSaveSuccess(v, elemento),
      error: (e: any) => this.handleSaveError(e),
      complete: () => this.handleSaveComplete()
    });
  }

  protected handleSaveError(error: any) {
    console.error(error);
    this.amosarMensagemErro();
  }

  protected handleSaveComplete() {
    const action = this.modo === EstadosPagina.engadir ? 'engadida' : 'guardada';
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Sucesso,
      mensagem: `${this.getNomeElemento()} ${action}.`
    });
  }

  protected handleError(context: string, error: any) {
    console.error(error);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puiderom obter os dados ${this.getNomeElemento()}.`
    });
  }

  protected isAdding(event: SubmitEvent): boolean {
    return (event.submitter as HTMLButtonElement)?.value === EstadosPagina.engadir;
  }

  private handleSaveSuccess(data: any, elemento: TElemento) {
    if (data.idResult > 0) {
      if (this.eGenero(elemento)) {
        this.usuarioAppService.setGenero(elemento);
      }
      this.handleNavigation(data, elemento);
      this.modo = EstadosPagina.guardar;
    } else {
      this.amosarMensagemErro();
    }
  }

  protected handleNavigation(data: any, elemento: TElemento) {
    const dados = data as { meta: { id: number } };
    if (dados) {
      elemento.id = dados.meta.id;
      this.dadosDoElemento = elemento;
      const dadoRequerido = this.dadosPaginasService.getNovoDado();
      if (dadoRequerido) {
        const novoDado: SimpleObjet = { id: elemento.id, value: elemento.nome };
        dadoRequerido.elemento = novoDado;
        this.dadosPaginasService.setNovoDado(dadoRequerido);
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  private eGenero(elemento: Genero | TElemento): elemento is Genero {
    return 'tipo' in elemento && elemento.tipo === 'propriedade para saver que o tipo é Género';
  }

  private amosarMensagemErro() {
    const action = this.modo === EstadosPagina.engadir ? 'engadir' : 'guardar';
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: `Nom se puido ${action} ${this.getNomeElemento()}.`
    });
  }
}
