import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { GenerosService } from 'src/app/core/services/api/generos.service';
import { LivrosService } from 'src/app/core/services/api/livros.service';
import { DadosPaginasService } from 'src/app/core/services/flow/dados-paginas.service';
import { ListadoLivros, ListadoLivrosData } from '../../livros/listado-livros/listado-livros.interface';
import { GeneroData, Parametros } from './genero.interface';
import { Genero } from 'src/app/shared/models/outros';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';

@Component({
  selector: 'omla-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit {

  engadir = 'Engadir'; guardar = 'Guardar';
  modo = this.engadir;
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
    private dadosPaginas: DadosPaginasService) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        let parametros = <Parametros>params;
        if (parametros.id == 0)
          this.modo = this.engadir;
        else {
          this.modo = this.guardar;
          this.obterDadosDoGenero(parametros.id);
        }
      }
    );
  }

  private obterDadosDoGenero(id: number): void {
    this.generosService
      .getGenero(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosDoGenero = this.dadosObtidos(v),
        error: (e) => { console.error(e),
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

  private obterLivros(id: number): void {
    console.debug('completada a obtençom dos dados do genero')
    this.livrosService
      .getListadoLivrosPorGenero(id)
      .pipe(first())
      .subscribe({
        next: (v) => this.dadosLivrosDaGenero = this.dadosLivrosObtidos(v),
        error: (e) => { console.error(e),
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
        .getGeneroPorNome(String(this.gf.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v) => generoRepetido = <GeneroData>v,
          error: (e) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do género.'}); },
          complete: () => this.guardarGenero(event, generoRepetido)
      });
    }
  }

  guardarGenero(event: any, generoRepetido: GeneroData) {
    if (generoRepetido != undefined && generoRepetido.meta.quantidade > 0 && (
      (event.submitter.value === this.engadir)
      ||
      (event.submitter.value !== this.engadir && generoRepetido.meta.id != this.dadosDoGenero?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do género já existe na base de dados'});
    }
    else {
      const genero: Genero = {
        id: Number(this.dadosDoGenero?.id),
        nome: String(this.gf.nome.value).trim(),
        comentario: (this.gf.comentario.value == null) ? null : String(this.gf.comentario.value).trim()
      };

      if (event.submitter.value === this.engadir) {
        this.generosService
          .postGenero(genero)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, genero)},
            error: (e) => {
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido engadir o género.'});
              console.error(e) },
            complete: () => {
              this.modo = this.guardar;
              this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Género engadido.'});
              console.debug('post completado'); }
        });
      }
      else {
        this.generosService
          .putGenero(genero)
          .pipe(first())
          .subscribe({
            next: (v) => {console.debug(v), this.gestionarRetroceso(v, genero)},
            error: (e) => {
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
      let novoDado = this.dadosPaginas.getNovoDado();
      if (novoDado) {
        novoDado.elemento = genero;
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

