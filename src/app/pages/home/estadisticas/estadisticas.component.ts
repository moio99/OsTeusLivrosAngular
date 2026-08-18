import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EstadisticasService, GraficosService, OutrosService} from '@servizosApi';
import { LayoutService, UsuarioAppService } from '@servizosFlow';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { EstadisticasTipo, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { OrdeColunaComponent } from '@componhentesComuns';
import { Estadisticas } from '../../../core/models/estadisticas.interface';
import { GraficosData } from '../../../core/models/graficos.interface';
import { PeticomPendenteComponent } from '../../../peticom-pendente.guard';
import { forkJoin } from 'rxjs';
import { BaseListadoDadosApi } from '../../../core/models/base-dados-api.interface';

@Component({
  selector: 'omla-estadisticas',
  standalone: true,
  imports: [OrdeColunaComponent],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit, PeticomPendenteComponent {

  isDadosCombosPendente = true;
  tipos = EstadisticasTipo;
  idiomasSignal = signal<Estadisticas[]>([]);
  anosSignal = signal<Estadisticas[]>([]);
  generosSignal = signal<Estadisticas[]>([]);

  ordeAnos = 'ordeAnos';
  ordeQuantidadeAnos = 'ordeQuantidadeAnos';
  ordePaginasAnos = 'ordePaginasAnos';
  tipoOrdeacomAnos = this.ordeAnos;
  inversoAnos = signal<boolean>(true);

  ordeQuantidadeGeneros = 'ordeQuantidadeGeneros';
  ordePaginasGeneros = 'ordePaginasGeneros';
  tipoOrdeacomGeneros = signal<string>(this.ordeQuantidadeGeneros);
  inversoGeneros = signal<boolean>(true);

  @ViewChild('subMenu') subMenu!: ElementRef;
  @ViewChild('taboaAnos') taboaAnos!: ElementRef;
  @ViewChild('taboaGenero') taboaGenero!: ElementRef;

  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);
  private readonly usuarioApp = inject(UsuarioAppService);
  private readonly estadisticasService = inject(EstadisticasService);
  private readonly outrosService = inject(OutrosService);
  private readonly graficosService = inject(GraficosService);

  constructor() {
    // effect(() => {
    //   if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) return;
    //   console.log('Cada vez que há umha mudança lánza-se isto ', this.anosSignal());
    // });
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

  setOrdeAnos() {
    this.inversoAnos.update(v => this.tipoOrdeacomAnos === this.ordeAnos ? !v : false);
    this.tipoOrdeacomAnos = this.ordeAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inversoAnos(), false));
      return listadoAnos;
    });
  }

  setOrdeQuantidadeAnos() {
    this.inversoAnos.update(v => this.tipoOrdeacomAnos === this.ordeQuantidadeAnos ? !v : false);
    this.tipoOrdeacomAnos = this.ordeQuantidadeAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoAnos(), false));
      return listadoAnos;
    });
  }

  setOrdePaginasAnos() {
    this.inversoAnos.update(v => this.tipoOrdeacomAnos === this.ordePaginasAnos ? !v : false);
    this.tipoOrdeacomAnos = this.ordePaginasAnos;

    this.anosSignal.update(listadoAnos => {
      listadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidadepaginas, b.quantidadepaginas, this.inversoAnos(), false));
      return listadoAnos;
    });
  }

  setOrdeQuantidadeGeneros() {
    this.inversoGeneros.update(v => this.tipoOrdeacomGeneros() === this.ordeQuantidadeGeneros ? !v : false);
    this.tipoOrdeacomGeneros.set(this.ordeQuantidadeGeneros);

    this.generosSignal.update(listadoGeneros => {
      listadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoGeneros(), false));
      return listadoGeneros;
    });
  }

  setOrdePaginasGeneros() {
    this.inversoGeneros.update(v => this.tipoOrdeacomGeneros() === this.ordePaginasGeneros ? !v : false);
    this.tipoOrdeacomGeneros.set(this.ordePaginasGeneros);

    this.generosSignal.update(listadoGeneros => {
      listadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidadepaginas, b.quantidadepaginas, this.inversoGeneros(), false));
      return listadoGeneros;
    });
  }

  // scrollAoElemento(target: ElementRef | HTMLElement | null | undefined): void {
  //   if (!target) return; // Se aínda nom existe no DOM, paramos de jeito seguro

  //   const element = target instanceof ElementRef ? target.nativeElement : target;
  //   requestAnimationFrame(() => {
  //     element.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //       inline: "nearest"
  //     });
  //   });
  // }
  scrollAoElemento(target: ElementRef | HTMLElement | null | undefined): void {
    if (!target) return;

    // Extraemos os elementos nativos se veñen de ElementRef
    const element = target instanceof ElementRef ? target.nativeElement : target;
    const contedor = this.layoutService.contedorScroll();

    if (contedor) {
      requestAnimationFrame(() => {
        const elementoTop = element.getBoundingClientRect().top;
        const contedorTop = contedor.getBoundingClientRect().top;
        const posicionFinal = contedor.scrollTop + (elementoTop - contedorTop);

        contedor.scrollTo({ top: posicionFinal, behavior: 'smooth' });
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
      });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        error: (e: unknown) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter os géneros.'}); },
          // complete: () => console.info('completado listado de generos')
    });
  }

  private obterEstadisticas(): void {

    const observavel1 = this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Idioma);  // Observavel 1
    const observavel2 = this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Ano);     // Observavel 2
    const observavel3 = this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Genero);  // Observavel 2

    forkJoin([observavel1, observavel2, observavel3])
      .subscribe({
        next: ([res1, res2, res3]) => {
          // só se ejecuta quando acabam as duas chamadas
          this.idiomasSignal.set(this.dadosObtidos(EstadisticasTipo.Idioma, res1));
          this.anosSignal.set(this.dadosObtidos(EstadisticasTipo.Ano, res2));
          this.generosSignal.set(this.dadosObtidos(EstadisticasTipo.Genero, res3));
        },
        error: (err) => {
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas.'});
        },
        // complete: () => {
        //   console.log('Todas las estadísticas cargadas');
        // }
    });
  }

  private dadosObtidos(tipo: EstadisticasTipo, data: object): Estadisticas[] {
    let resultados: Estadisticas[];
    const dados = <BaseListadoDadosApi<Estadisticas>>data;
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
