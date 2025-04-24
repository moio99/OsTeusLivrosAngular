import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Editorial, EditorialData } from '../../../core/models/editorial.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Parametros } from '../../../core/models/comun.interface';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';

@Component({
  selector: 'omla-editorial',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
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
    private dadosPaginasService: DadosPaginasService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let parametros = params as Parametros;
        if (parametros.id === '0')
          this.modo = EstadosPagina.engadir;
        else {
          this.modo = EstadosPagina.guardar;
          this.obterDadosDaEditorial(parametros.id);
        }

        if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
          this.modo = EstadosPagina.soVisualizar;
        }
      }
    );
  }

  private obterDadosDaEditorial(id: string): void {
    this.editoriaisService
      .getPorId(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosDaEditorial = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
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

  private obterLivros(id: string): void {
    console.debug('completada a obtençom dos dados da editorial')
    this.livrosService
      .getLivrosPorEditorial(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDaEditorial = this.dadosLivrosObtidos(v),
        error: (e: any) => { console.error(e),
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

      let editorialRepetido: EditorialData;
      this.editoriaisService
        .getPorNome(String(this.ef.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v: object) => editorialRepetido = <EditorialData>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados da editorial.'}); },
            complete: () => this.guardarEditorial(event, editorialRepetido)
      });
    }
  }

  guardarEditorial(event: any, editorialRepetido: EditorialData) {
    if (editorialRepetido != undefined && editorialRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && editorialRepetido.meta.id != this.dadosDaEditorial?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome da editorial já existe na base de dados'});
    }
    else {
      const editorial: Editorial = {
        id: Number(this.dadosDaEditorial?.id),
        nome: String(this.ef.nome.value),
        direicom: (this.ef.direicom.value == null) ? null : String(this.ef.direicom.value).trim(),
        web: (this.ef.web.value == null) ? null : String(this.ef.web.value).trim(),
        comentario: (this.ef.comentario.value == null) ? null : String(this.ef.comentario.value).trim()
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.editoriaisService
          .create(editorial)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir a editorial.'});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial engadida.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.editoriaisService
          .update(editorial)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, editorial)},
            error: (e: any) => {
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
      this.dadosDaEditorial = editorial;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = editorial;
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

