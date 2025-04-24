import { Component, effect, OnDestroy, OnInit, signal  } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EstadisticasService } from '../../../core/services/api/estadisticas.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EstadisticasTipo, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { Estadisticas, EstadisticasData } from '../../../core/models/estadisticas.interface';
import { GraficosData } from '../../../core/models/graficos.interface';
import { GraficosService } from '../../../core/services/api/graficos.service';
import { HttpClientModule } from '@angular/common/http';
import { OutrosService } from '../../../core/services/api/outros.service';
import { PeticomPendenteComponent } from '../../../peticom-pendente.guard';
import { environment, environments } from '../../../../environments/environment';
import { UsuarioAppService } from '../../../core/services/flow/usuario-app.service';

@Component({
  selector: 'omla-estadisticas',
  standalone: true,
  imports: [OrdeColunaComponent, HttpClientModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit, OnDestroy, PeticomPendenteComponent {

  isDadosCombosPendente = true;
  tipos = EstadisticasTipo;
  idiomasSignal = signal<Estadisticas[]>([]);
  anosSignal = signal<Estadisticas[]>([]);
  generosSignal = signal<Estadisticas[]>([]);

  ordeAnos = 'ordeAnos';
  ordeQuantidadeAnos = 'ordeQuantidadeAnos';
  ordePaginasAnos = 'ordePaginasAnos';
  tipoOrdeacomAnos = this.ordeAnos;
  inversoAnos = true;

  ordeQuantidadeGeneros = 'ordeQuantidadeGeneros';
  ordePaginasGeneros = 'ordePaginasGeneros';
  tipoOrdeacomGeneros = this.ordeQuantidadeGeneros;
  inversoGeneros = true;

  constructor(
    private router: Router,
    private usuarioApp: UsuarioAppService,
    private estadisticasService: EstadisticasService,
    private outrosService: OutrosService,
    private graficosService: GraficosService,
    private layoutService: LayoutService) {

    effect(() => {
      if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) return;
      console.log('Cada vez que ha umha mudança lánza-se isto ', this.anosSignal());
    });
  }

  ngOnInit(): void {
    this.layoutService.amosarInfo(undefined);
    this.obterEstadisticas();
    this.obterDadosOutros();
  }

  podoDeactivate(): boolean {
    if (this.isDadosCombosPendente) {
      alert('Todabía todos os dados nom forom carregados, agarde um chisco...');
      return false
    }
    return true;
  }

  ngOnDestroy(): void {
    if (this.layoutService) {
      this.layoutService.unsubscribe(); // Desuscribirse para evitar fugas de memoria
    }
  }

  setOrdeAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos === this.ordeAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordeAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inversoAnos, false));
      return listadoAnos;
    });
  }

  setOrdeQuantidadeAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos === this.ordeQuantidadeAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordeQuantidadeAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoAnos, false));
      return listadoAnos;
    });
  }

  setOrdePaginasAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos === this.ordePaginasAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordePaginasAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidadePaginas, b.quantidadePaginas, this.inversoAnos, false));
      return listadoAnos;
    });
  }

  setOrdeQuantidadeGeneros() {
    this.inversoGeneros = (this.tipoOrdeacomGeneros === this.ordeQuantidadeGeneros) ? !this.inversoGeneros : false;
    this.tipoOrdeacomGeneros = this.ordeQuantidadeGeneros;

    this.generosSignal.update(listadoGeneros => {
      listadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoGeneros, false));
      return listadoGeneros;
    });
  }

  setOrdePaginasGeneros() {
    this.inversoGeneros = (this.tipoOrdeacomGeneros === this.ordePaginasGeneros) ? !this.inversoGeneros : false;
    this.tipoOrdeacomGeneros = this.ordePaginasGeneros;

    this.generosSignal.update(listadoGeneros => {
      listadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidadePaginas, b.quantidadePaginas, this.inversoGeneros, false));
      return listadoGeneros;
    });
  }

  scrollAoElemento(elementId: string): void {
    const elemento = document.getElementById(elementId);
    elemento?.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  /**
   * Navega a umha página.
   * @param rota
   * @param tipo
   * @param id
   */
  onGoListadoLivros(rota: string, tipo: EstadisticasTipo, id: number): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?tipo=' + tipo + '&id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }

  onGoGraficos(rota: string): void{
    this.graficosService
      .getGraficosPaginasPorIdiomaEAno()
      .pipe(first())
      .subscribe({
        next: (v: any) => this.comprobarDadosObtidos(rota, v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os géneros.'}); },
          // complete: () => console.info('completado listado de generos')
    });
  }

  private obterEstadisticas(): void {
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Idioma)
      .pipe(first())
      .subscribe({
        next: (v) => this.idiomasSignal.set(this.dadosObtidos(EstadisticasTipo.Idioma, v)),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por idiomas.'}); },
          // complete: () => console.info('completado por Idiomas')
    });
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Ano)
      .pipe(first())
      .subscribe({
        next: (v) => this.anosSignal.set(this.dadosObtidos(EstadisticasTipo.Ano, v)),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por anos.'}); },
          complete: () => console.info('completado por Anos')
    });
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Genero)
      .pipe(first())
      .subscribe({
        next: (v) => this.generosSignal.set(this.dadosObtidos(EstadisticasTipo.Genero, v)),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por géneros.'}); },
          // complete: () => console.info('completado por Genero')
    });
  }

  private dadosObtidos(tipo: EstadisticasTipo, data: object): Estadisticas[] {
    let resultados: Estadisticas[];
    const dados = <EstadisticasData>data;
    if (dados != null) {
      this.estadisticasService.setGraficosPaginasPorIdiomaEAno(tipo, dados);
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      // console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  private comprobarDadosObtidos(rota: string, data: object) {
    this.layoutService.amosarInfo(undefined);

    const dados = <GraficosData>data;
    if (dados != null) {
      this.graficosService.setGraficosPaginasPorIdiomaEAno(dados);
      this.router.navigate([rota], {
        state: { dados: dados.data },
      });
    } else {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
  }

  private obterDadosOutros() {
    if (this.usuarioApp.haDadosOutros()) {
      this.isDadosCombosPendente = false;
    } else {
      this.outrosService.getTodo()
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.isDadosCombosPendente = false;
            this.usuarioApp.setDadosOutros(data);
          },
          error: () => {
            this.isDadosCombosPendente = false;
          },
      });
    }
  }
}
