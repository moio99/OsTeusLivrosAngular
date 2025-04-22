import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListadoLivros, ListadoLivrosData } from '../../../core/models/listado-livros.interface';
import { LivrosService } from '../../../core/services/api/livros.service';
import { DadosPaginasService } from '../../../core/services/flow/dados-paginas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Parametros } from '../../../core/models/comun.interface';
import { EstiloLiterario, EstiloLiterarioData } from '../../../core/models/estilos-literarios.interface';
import { EstilosLiterariosService } from '../../../core/services/api/estilos-literarios.service';
import { environment, environments } from '../../../../environments/environment';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';

@Component({
  selector: 'omla-estilo-literario',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule
    /* , MatDatepickerModule, MatNativeDateModule */],
  templateUrl: './estilo-literario.component.html',
  styleUrls: ['./estilo-literario.component.scss']
})
export class EstiloLiterarioComponent implements OnInit {

  estadosPagina = EstadosPagina;
  modo = EstadosPagina.soVisualizar;
  dadosDoEstiloLiterario: EstiloLiterario | undefined = {
    id: 0,
    nome: '',
    comentario: ''
  };
  dadosLivrosDoEstiloLiterario: ListadoLivros[] = [];

  estiloLiterarioForm = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    comentario: new FormControl('', Validators.maxLength(50000))
  });
  get gf() { return this.estiloLiterarioForm.controls; }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private location: Location,
    private estilosLiterariosService: EstilosLiterariosService,
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
          this.obterDadosDoEstiloLiterario(parametros.id);
        }

        if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
          this.modo = EstadosPagina.soVisualizar;
        }
      }
    );
  }

  private obterDadosDoEstiloLiterario(id: string): void {
    this.estilosLiterariosService
      .getEstiloLiterario(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosDoEstiloLiterario = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do género.'}); },
          complete: () => this.obterLivros(id)
    });
  }

  private dadosObtidos(data: object): EstiloLiterario  | undefined {
    let resultados: EstiloLiterario | undefined;
    const dados = <EstiloLiterarioData>data;
    if (dados.estiloLiterario.length > 0) {
      resultados = dados.estiloLiterario[0];
      if (resultados != undefined) {
        this.gf.nome.setValue(dados.estiloLiterario[0].nome);
        if (dados.estiloLiterario[0].comentario)
          this.gf.comentario.setValue(dados.estiloLiterario[0].comentario);
      }
    }
    else{
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do género'});
      resultados = undefined;
    }
    return resultados
  }

  private obterLivros(id: string): void {
    console.debug('completada a obtençom dos dados do estiloLiterario')
    this.livrosService
      .getListadoLivrosPorEstiloLiterario(id)
      .pipe(first())
      .subscribe({
        next: (v: object) => this.dadosLivrosDoEstiloLiterario = this.dadosLivrosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os Livros do género.'}); },
          complete: () => console.debug('completada a obtençom dos livros do estiloLiterario')
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
      let estiloLiterarioRepetido: EstiloLiterarioData;
      this.estilosLiterariosService
        .getEstiloLiterarioPorNome(String(this.gf.nome.value).trim())
        .pipe(first())
        .subscribe({
          next: (v: object) => estiloLiterarioRepetido = <EstiloLiterarioData>v,
          error: (e: any) => { console.error(e),
            this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os dados do género.'}); },
            complete: () => this.guardarEstiloLiterario(event, estiloLiterarioRepetido)
      });
    }
  }

  guardarEstiloLiterario(event: any, estiloLiterarioRepetido: EstiloLiterarioData) {
    if (estiloLiterarioRepetido != undefined && estiloLiterarioRepetido.meta.quantidade > 0 && (
      (event.submitter.value === EstadosPagina.engadir)
      ||
      (event.submitter.value !== EstadosPagina.engadir && estiloLiterarioRepetido.meta.id != this.dadosDoEstiloLiterario?.id))) { // se está actualizando os ids deben ser inguais
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'O nome do género já existe na base de dados'});
    }
    else {
      const estiloLiterario: EstiloLiterario = {
        id: Number(this.dadosDoEstiloLiterario?.id),
        nome: String(this.gf.nome.value).trim(),
        comentario: (this.gf.comentario.value == null) ? null : String(this.gf.comentario.value).trim()
      };

      if (event.submitter.value === EstadosPagina.engadir) {
        this.estilosLiterariosService
          .postEstiloLiterario(estiloLiterario)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, estiloLiterario)},
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
        this.estilosLiterariosService
          .putEstiloLiterario(estiloLiterario)
          .pipe(first())
          .subscribe({
            next: (v: object) => {console.debug(v), this.gestionarRetroceso(v, estiloLiterario)},
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

  private gestionarRetroceso(data: object, estiloLiterario: EstiloLiterario) {
    const dados = <ListadoLivrosData>data;
    if (dados) {
      estiloLiterario.id = dados.meta.id;
      this.dadosDoEstiloLiterario = estiloLiterario;
      let novoDado = this.dadosPaginasService.getNovoDado();
      if (novoDado) {
        novoDado.elemento = estiloLiterario;
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

