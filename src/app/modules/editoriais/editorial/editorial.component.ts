import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { EditoriaisService } from 'src/app/core/services/api/editoriais.service';
import { LivrosService } from 'src/app/core/services/api/livros.service';
import { DadosPaginasService } from 'src/app/core/services/flow/dados-paginas.service';
import { ListadoLivros, ListadoLivrosData } from '../../livros/listado-livros/listado-livros.interface';
import { Editorial, EditorialData, Parametros } from './editorial.interface';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';

@Component({
  selector: 'omla-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit {

  engadir = 'Engadir'; guardar = 'Guardar';
  modo = this.engadir;
  dadosDaEditorial: Editorial | undefined = {
    id: 0,
    nome: '',
    web: '',
    direicom: '',
    comentario: ''
  };
  dadosLivrosDaEditorial: ListadoLivros[] = [];

  editorialForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    direicom: new FormControl('', Validators.maxLength(150)),
    web: new FormControl('', Validators.maxLength(150)),
    comentario: new FormControl('', Validators.maxLength(50000))
  });
  get ef() { return this.editorialForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private location: Location,
    private editoriaisService: EditoriaisService,
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
          this.obterDadosDaEditorial(parametros.id);
        }
      }
    );
  }

  private obterDadosDaEditorial(id: number): void {
    this.editoriaisService
      .getEditorial(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosDaEditorial = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da editorial.'}); },
        complete: () => this.obterLivros(id)
    });
  }

  private dadosObtidos(data: object): Editorial  | undefined {
    let resultados: Editorial | undefined;
    const dados = <EditorialData>data;
    if (dados.editorial.length > 0) {
      resultados = dados.editorial[0];
      if (resultados != undefined) {
        this.ef.nome.setValue(dados.editorial[0].nome);
        this.ef.direicom.setValue(dados.editorial[0].direicom);
        this.ef.web.setValue(dados.editorial[0].web);
        this.ef.comentario.setValue(dados.editorial[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados da editorial'});
      resultados = undefined;
    }
    return resultados
  }

  private obterLivros(id: number): void {
    console.debug('completada a obtençom dos dados da editorial')
    this.livrosService
      .getLivrosPorEditorial(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosLivrosDaEditorial = this.dadosLivrosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os Livros da editorial.'}); },
        complete: () => console.debug('completada a obtençom dos livros da editorial')
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
    if (this.ef.nome.status === 'VALID' && this.ef.direicom.status === 'VALID'
      && this.ef.web.status === 'VALID' && this.ef.comentario.status === 'VALID') {

      const editorial: Editorial = {
        id: Number(this.dadosDaEditorial?.id),
        nome: String(this.ef.nome.value),
        direicom: (this.ef.direicom.value == null) ? null : String(this.ef.direicom.value).trim(),
        web: (this.ef.web.value == null) ? null : String(this.ef.web.value).trim(),
        comentario: (this.ef.comentario.value == null) ? null : String(this.ef.comentario.value).trim()
      };

      if (event.submitter.value === this.engadir) {
        this.editoriaisService
          .postEditorial(editorial)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a editorial.'});
              console.error(e) },
            complete: () => { this.modo = this.guardar;
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial engadida.'});
              console.debug('post completado'); }
        });
      }
      else {
        this.editoriaisService
          .putEditorial(editorial)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar a editorial.'});
              console.error(e) },
            complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial guardada.'});
              console.debug('put completado') }
        });
      }
    }
  }

  private gestionarRetroceso(data: object, editorial: Editorial) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      editorial.id = dados.meta.id;
      let novoDado = this.dadosPaginas.getNovoDado();
      if (novoDado) {
        novoDado.elemento = editorial;
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

