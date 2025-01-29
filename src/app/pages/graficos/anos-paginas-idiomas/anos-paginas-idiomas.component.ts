import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes } from '@angular/router';
import { ChartComponent, NgApexchartsModule} from "ng-apexcharts";
import { Graficos } from '../../../core/models/graficos.interface';
import { AreasChartOptions } from '../../../core/types/chart.options';
import { CoresIdiomasService } from '../../../core/services/flow/cores-idiomas.sevice';
import { CoresIdioma } from '../../../shared/cores.idiomas.config';

@Component({
  imports: [ NgApexchartsModule ],
  selector: 'app-anos-paginas-idiomas',
  standalone: true,
  templateUrl: './anos-paginas-idiomas.component.html',
  styleUrl: './anos-paginas-idiomas.component.scss'
})
export class AnosPaginasIdiomasComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  coresIdiomas: { [key: string]: CoresIdioma } = {};

  public chartOptions: Partial<AreasChartOptions> = {
    series: [],
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },

    title: {
      text: "Estadísticas por idioma",
      align: "left"
    },
    subtitle: {
      text: "Páginas lidas por ano",
      align: "left"
    },
    labels: [],
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: "left"
    }
  };

  constructor(
    private coresIdiomasService: CoresIdiomasService
  ) { }

  ngOnInit(): void {
    this.coresIdiomas = this.coresIdiomasService.getCoresIdiomas();
    const state = history.state;
    if (state?.dados) {
      this.separarDadosPorIdioma(state?.dados);
    }
  }

  private separarDadosPorIdioma(data: Graficos[]) {
    let labelsAnos: string[] = [];  // Etiquetas para amosar no gráfico ejo das x
    let idiomas: string[] = [];     // Os quatro idiomas
    let datosPorIdioma: { [key: string]: Graficos[] } = {};           // Dados agrupados por idioma e ano
    let datosPorIdiomaComTodosOsAnos: { [key: string]: any[] } = {};  // Páginas por idoma para amosar no gráfico
    let cores: string[] = [];                               // cores para amosar

    data.forEach(dado => {
      // dado.idioma: 'Galician-AGAL   +   dado.id: 1999
      if (!datosPorIdioma[dado.idioma + dado.id]) {   // Se nom existe a matriz a vou criar
        datosPorIdioma[dado.idioma + dado.id] = [];
      }
      datosPorIdioma[dado.idioma + dado.id].push(
        { id: dado.id, idioma: dado.idioma, idIdioma: dado.idIdioma, quantidadePaginas: dado.quantidadePaginas }
      );

      if (!labelsAnos.includes(dado.id.toString())) {
        labelsAnos.push(dado.id.toString());
      }
      if (!idiomas.includes(dado.idioma)) {
        idiomas.push(dado.idioma);
        cores.push(this.coresIdiomas[dado.idIdioma].cor);
      }
    });
    console.log(datosPorIdioma);

    labelsAnos.forEach(ano => {
      idiomas.forEach(idioma => {
        if (!datosPorIdiomaComTodosOsAnos[idioma]) {
          datosPorIdiomaComTodosOsAnos[idioma] = [];
        }
        const quantidade = datosPorIdioma[idioma + ano];
        let previo = 0;
        if (datosPorIdiomaComTodosOsAnos[idioma].length > 0) {
          previo = datosPorIdiomaComTodosOsAnos[idioma][datosPorIdiomaComTodosOsAnos[idioma].length - 1];
        }
        if (quantidade) {
          datosPorIdiomaComTodosOsAnos[idioma].push(previo + quantidade[0].quantidadePaginas);
        } else {
          datosPorIdiomaComTodosOsAnos[idioma].push(previo);
        }
      })
    });
    this.chartOptions.labels = labelsAnos;
    this.chartOptions.series = [];
    let series: any[] = [];
    idiomas.forEach(idioma => {
      series.push({
        name: idioma,
        data: datosPorIdiomaComTodosOsAnos[idioma]
      });
    });

    this.carregarDadosNoChartOptions(labelsAnos, series, cores);
  }

  private carregarDadosNoChartOptions(labelsAnos: string[], series: any[], cores: string[]) {
    this.chartOptions = {
      series: series,
      colors: cores,
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Estadísticas por idioma",
        align: "left"
      },
      subtitle: {
        text: "Páginas lidas por ano",
        align: "left"
      },
      labels: labelsAnos,
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        opposite: true
      },
      legend: {
        horizontalAlign: "left"
      }
    };
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: AnosPaginasIdiomasComponent,
  },
  /* {
    path: 'livro',
    component: LivroComponent
  } */
];
