import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Colecom, ColecomData } from '../../../core/models/colecom.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Parametros } from '../../../core/models/comun.interface';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';

@Component({
  selector: 'omla-colecom',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule ],
  templateUrl: './colecom.component.html',
  styleUrls: ['./colecom.component.scss']
})
export class ColecomComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
  disabledFormulario = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro ? true : false;
  dadosDaColecom: Colecom | undefined = {
    id: 0,
    nome: '',
    isbn: '',
    web: '',
    comentario: ''
  };
  dadosLivrosDaColecom: ListadoLivros[] = [];

  colecomForm = new FormGroup({
    nome: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.required, Validators.maxLength(150)]),
    isbn: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(20)]),
    web: new FormControl({ value: '', disabled: this.disabledFormulario}, [Validators.maxLength(150)]),
    comentario: new FormControl({ value: '', disabled: this.disabledFormulario}, Validators.maxLength(50000))
  });
  get cf() { return this.colecomForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private layoutService: LayoutService,
    private coleconsService: ColeconsService,
    private livrosService: LivrosService,
    private dadosPaginasService: DadosPaginasService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let parametros = params as Parametros;
        if (parametros.id === '0')
          this.modo = EstadosPagina.engadir;
        else {
          this.modo = EstadosPagina.guardar;
          this.obterDadosDaColecom(parametros.id);
        }

        if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
          this.modo = EstadosPagina.soVisualizar;
        }
      }
    );
  }

  private obterDadosDaColecom(id: string): void {
    this.coleconsService
      .getPorId(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosDaColecom = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da coleçom.'}); },
          complete: () => this.obterLivros(id)
    });
  }

  private dadosObtidos(data: object): Colecom  | undefined {
    let resultados: Colecom | undefined;
    const dados = <ColecomData>data;
    if (dados.colecom.length > 0) {
      resultados = dados.colecom[0];
      if (resultados != undefined) {
        this.cf.nome.setValue(dados.colecom[0].nome);
        this.cf.isbn.setValue(dados.colecom[0].isbn);
        this.cf.web.setValue(dados.colecom[0].web);
        this.cf.comentario.setValue(dados.colecom[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados da coleçom'});
      resultados = undefined;
    }
    return resultados
  }

  private obterLivros(id: string): void {
    console.debug('completada a obtençom dos dados da coleçom')
    this.livrosService
      .getLivrosPorColecom(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDaColecom = this.dadosLivrosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os Livros da coleçom.'}); },
          complete: () => console.debug('completada a obtençom dos livros da coleçom')
    });
  }

  private dadosLivrosObtidos(data: object): ListadoLivros[] {
    let resultados: ListadoLivros[];
    const dados = <ListadoLivrosData>data;
    if (dados != null) {
      console.debug('quantidade: ' + dados.meta.quantidade + ' ' + dados.data);
      console.debug(dados.data);
      resultados = dados.data;
    } else {
      resultados = [];
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onSubmit(event: any) {
    if (this.cf.nome.status === 'VALID'  && this.cf.isbn.status === 'VALID'
      && this.cf.web.status === 'VALID'  && this.cf.comentario.status === 'VALID') {
        let colecomRepetido: ColecomData;
        this.coleconsService
          .getPorNome(String(this.cf.nome.value).trim())
          .pipe(first())
          .subscribe({
            next: (v: object) => colecomRepetido = <ColecomData>v,
            error: (e: any) => { console.error(e),
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da coleçom.'}); },
              complete: () => this.guardarColecom(event, colecomRepetido)
        });
    }
  }

  guardarColecom(event: any, colecomRepetido: ColecomData) {
    if (colecomRepetido != undefined && colecomRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && colecomRepetido.meta.id != this.dadosDaColecom?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome da coleçom já existe na base de dados'});
    }
    else {
      const colecom: Colecom = {
        id: Number(this.dadosDaColecom?.id),
        nome: String(this.cf.nome.value).trim(),
        isbn: (this.cf.isbn.value == null) ? null : String(this.cf.isbn.value).trim(),
        web: (this.cf.web.value == null) ? null : String(this.cf.web.value).trim(),
        comentario: (this.cf.comentario.value == null) ? null : String(this.cf.comentario.value).trim()
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.coleconsService
          .create(colecom)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, colecom)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a coleçom.'});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Coleçom engadida.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.coleconsService
          .update(colecom)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, colecom)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a coleçom.'});
              console.error(e) },
              complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Coleçom guardada.'});
              console.debug('put completado') }
        });
      }
    }
  }

  private gestionarRetroceso(data: object, colecom: Colecom) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      colecom.id = dados.meta.id;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = colecom;
        this.dadosDaColecom = colecom;
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  onCancelar() {
    this.dadosPaginasService.setNovoDado(undefined);
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}
