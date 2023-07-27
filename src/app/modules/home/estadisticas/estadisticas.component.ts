import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EstadisticasService } from 'src/app/core/services/api/estadisticas.service';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { Ordeacom } from 'src/app/shared/classes/ordeacom';
import { EstadisticasTipo, InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos'
import { Estadisticas, EstadisticasData } from './estadisticas.interface';

@Component({
  selector: 'omla-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {

  tipos = EstadisticasTipo;
  resultadoIdiomas: Estadisticas[] = [];
  resultadoAnos: Estadisticas[] = [];
  resultadoGeneros: Estadisticas[] = [];

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
    private estadisticasService: EstadisticasService,
    private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.amosarInfo(undefined);
    this.obterEstadisticas();
  }

  private obterEstadisticas(): void {
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Idioma)
      .pipe(first())
      .subscribe({
        next: (v) => this.resultadoIdiomas = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por idiomas.'}); },
        complete: () => console.info('completado por Idiomas')
    });
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Ano)
      .pipe(first())
      .subscribe({
        next: (v) => this.resultadoAnos = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por anos.'}); },
        complete: () => console.info('completado por Anos')
    });
    this.estadisticasService
      .getEstadisticas(EstadisticasTipo.Genero)
      .pipe(first())
      .subscribe({
        next: (v) => this.resultadoGeneros = this.dadosObtidos(v),
        error: (e) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: 'Nom se puiderom obter as estadísticas por géneros.'}); },
        complete: () => console.info('completado por Genero')
    });
  }

  private dadosObtidos(data: object): Estadisticas[] {
    let resultados: Estadisticas[];
    const dados = <EstadisticasData>data;
    if (dados != null) {
      console.debug(dados.data);
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  setOrdeAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos == this.ordeAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordeAnos;

    this.resultadoAnos.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inversoAnos, false));
  }

  setOrdeQuantidadeAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos == this.ordeQuantidadeAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordeQuantidadeAnos;

    this.resultadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoAnos, false));
  }

  setOrdePaginasAnos() {
    this.inversoAnos = (this.tipoOrdeacomAnos == this.ordePaginasAnos) ? !this.inversoAnos : false;
    this.tipoOrdeacomAnos = this.ordePaginasAnos;

    this.resultadoAnos.sort((a,b) => new Ordeacom().ordear(a.quantidadePaginas, b.quantidadePaginas, this.inversoAnos, false));
  }

  setOrdeQuantidadeGeneros() {
    this.inversoGeneros = (this.tipoOrdeacomGeneros == this.ordeQuantidadeGeneros) ? !this.inversoGeneros : false;
    this.tipoOrdeacomGeneros = this.ordeQuantidadeGeneros;

    this.resultadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidade, b.quantidade, this.inversoGeneros, false));
  }

  setOrdePaginasGeneros() {
    this.inversoGeneros = (this.tipoOrdeacomGeneros == this.ordePaginasGeneros) ? !this.inversoGeneros : false;
    this.tipoOrdeacomGeneros = this.ordePaginasGeneros;

    this.resultadoGeneros.sort((a,b) => new Ordeacom().ordear(a.quantidadePaginas, b.quantidadePaginas, this.inversoGeneros, false));
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
}
