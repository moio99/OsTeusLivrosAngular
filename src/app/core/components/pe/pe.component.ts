import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/flow/layout.service';
import { InformacomPeTipo } from 'src/app/shared/enums/estadisticasTipos';
import { InformacomPe } from 'src/app/shared/models/outros';

@Component({
  selector: 'omla-pe',
  templateUrl: './pe.component.html',
  styleUrls: ['./pe.component.scss'],
  animations: [trigger('amosarOcultarMensagem', [
      state('amosando', style({
        height: '29px'
      })),
      state('ocultando', style({
        height: '0px'
      })),
      transition('amosando => ocultando', [  // Aparece
        animate('0.4s')
      ]),
      transition('ocultando => amosando', [  // Oculta-se
        animate('0.08s')
      ]),
    ]),
  ],
})
export class PeComponent implements OnInit {

  visivel = false;
  tipos = InformacomPeTipo;
  tipo = InformacomPeTipo.Info;
  mensagemPadrom = 'Informaçom da web';
  mensagem = this.mensagemPadrom;
  timeOutIDs:number[] = [];

  constructor(private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.layoutService.getInformacom().subscribe((info: InformacomPe | undefined) => {
      this.amosar(info);
    });
  }

  private async amosar(info: InformacomPe | undefined) {
    if (info) {
      this.tipo = info.tipo;
      this.mensagem = info.mensagem;
      //if (this.tipo != InformacomPeTipo.Info) {
        this.visivel = true;
        if (info.duracom)
          await this.pausa(info.duracom * 1000);
        else
          await this.pausa(5000);
        this.visivel = false;
      //}
    }
  }

  /**
   * Realiza umha pausa do tempo passado.
   * @param ms Tempo em milisegundos.
   */
  pausa(ms: number) {
    return new Promise( resolve => {setTimeout(resolve, ms); } );
  }
}
