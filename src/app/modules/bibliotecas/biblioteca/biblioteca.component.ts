import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { BibliotecasService } from 'src/app/core/services/api/bibliotecas.service';
import { LivrosService } from 'src/app/core/services/api/livros.service';
import { DadosPaginasService } from 'src/app/core/services/flow/dados-paginas.service';
import { ListadoLivros, ListadoLivrosData } from '../../livros/listado-livros/listado-livros.interface';
import { Biblioteca, BibliotecaData, Parametros } from './biblioteca.interface';
import { DateConvert } from 'src/app/shared/classes/date-convert';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';

@Component({
  selector: 'omla-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {

  engadir = 'Engadir'; guardar = 'Guardar';
  modo = this.engadir;
  dadosDaBiblioteca: Biblioteca | undefined = {
    id: 0,
    nome: '',
    endereco: '',
    localidade: '',
    telefone: '',
    dataAsociamento: '',
    dataRenovacom: '',
    comentario: ''
  };
  dadosLivrosDaBiblioteca: ListadoLivros[] = [];

  bibliotecaForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    endereco: new FormControl('', [Validators.maxLength(150)]),
    localidade: new FormControl('', [Validators.maxLength(100)]),
    telefone: new FormControl('', [Validators.maxLength(50)]),
    dataAsociamento: new FormControl(''),
    dataRenovacom: new FormControl(''),
    comentario: new FormControl('', Validators.maxLength(50000))
  });
  get bf() { return this.bibliotecaForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private location: Location,
    private bibliotecasService: BibliotecasService,
    private livrosService: LivrosService,
    private dadosPaginas: DadosPaginasService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let parametros = <Parametros>params;
        if (parametros.id == 0)
          this.modo = this.engadir;
        else {
          this.modo = this.guardar;
          this.obterDadosDaBiblioteca(parametros.id);
        }
      }
    );
  }

  private obterDadosDaBiblioteca(id: number): void {
    this.bibliotecasService
      .getBiblioteca(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosDaBiblioteca = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter os dados da biblioteca.'}); },
        complete: () => this.obterLivros(id)
    });
  }

  private dadosObtidos(data: object): Biblioteca  | undefined {
    let resultados: Biblioteca | undefined;
    const dados = <BibliotecaData>data;
    if (dados.biblioteca.length > 0) {
      resultados = dados.biblioteca[0];
      if (resultados != undefined) {
        this.bf.nome.setValue(dados.biblioteca[0].nome);
        this.bf.endereco.setValue(dados.biblioteca[0].endereco);
        this.bf.localidade.setValue(dados.biblioteca[0].localidade);
        this.bf.telefone.setValue(dados.biblioteca[0].telefone);
        this.bf.dataAsociamento.setValue(dados.biblioteca[0].dataAsociamento);
        this.bf.dataRenovacom.setValue(dados.biblioteca[0].dataRenovacom);
        this.bf.comentario.setValue(dados.biblioteca[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados da biblioteca'});
      resultados = undefined;
    }
    return resultados
  }

  private obterLivros(id: number): void {
    console.debug('completada a obtençom dos dados da biblioteca')
    this.livrosService
      .getLivrosPorBiblioteca(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosLivrosDaBiblioteca = this.dadosLivrosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os Livros da coleçom.'}); },
        complete: () => console.debug('completada a obtençom dos livros da biblioteca')
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
    if (this.bf.nome.status === 'VALID'  && this.bf.endereco.status === 'VALID'
      && this.bf.localidade.status === 'VALID' && this.bf.telefone.status === 'VALID'
      && this.bf.dataAsociamento.status === 'VALID' && this.bf.dataRenovacom.status === 'VALID'
      && this.bf.comentario.status === 'VALID') {
      let bibliotecaRepetida: BibliotecaData;

      this.bibliotecasService
        .getBibliotecaPorNome(String(this.bf.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v) => bibliotecaRepetida = <BibliotecaData>v,
          error: (e) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da biblioteca.'}); },
          complete: () => this.guardarBiblioteca(event, bibliotecaRepetida)
      });
    }
  }

  guardarBiblioteca(event: any, bibliotecaRepetida: BibliotecaData) {
    if (bibliotecaRepetida != undefined && bibliotecaRepetida.meta.quantidade > 0 && (
      (event.submitter.value === this.engadir)
      ||
      (event.submitter.value !== this.engadir && bibliotecaRepetida.meta.id != this.dadosDaBiblioteca?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome da biblioteca já existe na base de dados'});
    }
    else {

      let dateConvert = new DateConvert();
      let dA = dateConvert.getDate(this.bf.dataAsociamento.value);
      let dR = dateConvert.getDate(this.bf.dataRenovacom.value);

      const biblioteca: Biblioteca = {
        id: Number(this.dadosDaBiblioteca?.id),
        nome: String(this.bf.nome.value),
        endereco: (this.bf.endereco.value == null) ? null : String(this.bf.endereco.value).trim(),
        localidade: (this.bf.localidade.value == null) ? null : String(this.bf.localidade.value).trim(),
        telefone: (this.bf.telefone.value == null) ? null : String(this.bf.telefone.value).trim(),
        dataAsociamento: (dA.year > 0) ? dA.year + '-' + dA.month + '-' + dA.day : '',
        dataRenovacom: (dR.year > 0) ? dR.year + '-' + dR.month + '-' + dR.day : '',
        comentario: (this.bf.comentario.value == null) ? null : String(this.bf.comentario.value).trim()
      };

      if (event.submitter.value === this.engadir) {
        this.bibliotecasService
          .postBiblioteca(biblioteca)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, biblioteca)},
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a biblioteca.'});
              console.error(e) },
            complete: () => {
              this.modo = this.guardar;
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Biblioteca engadida.'});
              console.debug('post completado'); }
        });
      }
      else {
        this.bibliotecasService
          .putBiblioteca(biblioteca)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, biblioteca)},
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a biblioteca.'});
              console.error(e) },
            complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Biblioteca guardada.'});
              console.debug('put completado') }
        });
      }
    }
  }

  private gestionarRetroceso(data: object, biblioteca: Biblioteca) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      biblioteca.id = dados.meta.id;
      this.dadosDaBiblioteca = biblioteca;
      let novoDado = this.dadosPaginas.getNovoDado();
      if (novoDado) {
        novoDado.elemento = biblioteca;
        this.layoutService.amosarInfo(undefined);
        this.location.back();
      }
    }
  }

  onCancelar() {
    this.dadosPaginas.setNovoDado(undefined);
    this.layoutService.amosarInfo(undefined);
    this.location.back();
  }

  onIrPagina(rota: string, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}
