import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Genero, GeneroData } from '../../../core/models/genero.interface';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { GenerosService } from '../../../core/services/api/generos.service';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Parametros } from '../../../core/models/comun.interface';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';

@Component({
  selector: 'omla-genero',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
  dadosDoGenero: Genero | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };
  dadosLivrosDaGenero: ListadoLivros[] = [];

  generoForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    comentario: new FormControl('', Validators.maxLength(50000))
  });
  get gf() { return this.generoForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private location: Location,
    private generosService: GenerosService,
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
          this.obterDadosDoGenero(parametros.id);
        }

        if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
          this.modo = EstadosPagina.soVisualizar;
        }
      }
    );
  }

  private obterDadosDoGenero(id: string): void {
    this.generosService
      .getGenero(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosDoGenero = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do género.'}); },
          complete: () => this.obterLivros(id)
    });
  }

  private dadosObtidos(data: object): Genero  | undefined {
    let resultados: Genero | undefined;
    const dados = <GeneroData>data;
    if (dados.genero.length > 0) {
      resultados = dados.genero[0];
      if (resultados != undefined) {
        this.gf.nome.setValue(dados.genero[0].nome);
        if (dados.genero[0].comentario)
          this.gf.comentario.setValue(dados.genero[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do género'});
      resultados = undefined;
    }
    return resultados
  }

  private obterLivros(id: string): void {
    console.debug('completada a obtençom dos dados do genero')
    this.livrosService
      .getListadoLivrosPorGenero(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDaGenero = this.dadosLivrosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os Livros do género.'}); },
          complete: () => console.debug('completada a obtençom dos livros do genero')
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
    if (this.gf.nome.status === 'VALID' && this.gf.comentario.status === 'VALID') {
      let generoRepetido: GeneroData;
      this.generosService
        .getGeneroPorNome(String(this.gf.nome.value).trim())  // Para comprobar que nom exista já um género co mesmo nome
        .pipe(first())
        .subscribe({
          next: (v: object) => generoRepetido = <GeneroData>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do género.'}); },
            complete: () => this.guardarGenero(event, generoRepetido)
      });
    }
  }

  private guardarGenero(event: any, generoRepetido: GeneroData) {
    if (generoRepetido != undefined && generoRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && generoRepetido.meta.id != this.dadosDoGenero?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do género já existe na base de dados'});
    }
    else {
      const genero: Genero = {
        id: Number(this.dadosDoGenero?.id),
        nome: String(this.gf.nome.value).trim(),
        comentario: (this.gf.comentario.value == null) ? null : String(this.gf.comentario.value).trim()
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.generosService
          .postGenero(genero)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, genero)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o género.'});
              console.error(e) },
              complete: () => {
                this.modo = EstadosPagina.guardar;
                this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Género engadido.'});
                // console.debug('post completado');
              }
        });
      }
      else {
        this.generosService
          .putGenero(genero)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, genero)},
            error: (e: any) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido guardar o género.'});
              console.error(e) },
              complete: () => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Género guardado.'});
              console.debug('put completado') }
        });
      }

    }
  }

  private gestionarRetroceso(data: object, genero: Genero) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      genero.id = dados.meta.id;
      this.dadosDoGenero = genero;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = genero;
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

  onIrPagina(rota: string, id: string, idRelectura: string = '0'): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id + '&idRelectura=' + idRelectura);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}

