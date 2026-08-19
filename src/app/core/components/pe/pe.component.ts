import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { InformacomPe } from '../../../shared/models/outros.model';
import { LayoutService } from '@servizosFlow';

@Component({
  selector: 'omla-pe',
  standalone: true,
  templateUrl: './pe.component.html',
  styleUrls: ['./pe.component.scss']
})
export class PeComponent {
  // En Angular moderno preferimos inject() a poñelo no constructor
  private layoutService = inject(LayoutService);

  visivel = signal<boolean>(false);
  tipos = InformacomPeTipo;
  tipo = signal(InformacomPeTipo.Info);
  mensagem = signal<string>('Informaçom da web');

  // Guardamos a referencia do timeout activo para poder cancelalo
  private currentTimeoutId: any = null;

  // ngOnInit(): void {
  //   this.layoutService.getInformacom().subscribe((info: InformacomPe | undefined) => {
  //     this.procesarMensaxe(info);
  //   });
  // }
  constructor() {
    // Creamos un efecto que se executará automaticamente cada vez que
    // cambie o Signal 'informacom' no LayoutService
    effect(() => {
      const info = this.layoutService.informacom(); // Angular detecta que lemos este Signal
      this.procesarMensaxe(info); // Chamamos á función pasándolle o novo valor
    });
  }

  private procesarMensaxe(info: InformacomPe | undefined) {
    // Limpamos calquera temporizador activo para que a nova mensaxe tome o control
    if (this.currentTimeoutId) {
      clearTimeout(this.currentTimeoutId);
    }

    if (info) {
      this.tipo.set(info.tipo);
      this.mensagem.set(info.mensagem);
      this.visivel.set(true);

      // Calculamos a duración (por defecto 5000ms)
      const duracion = info.duracom ? info.duracom * 1000 : 5000;

      // Programamos o peche de forma segura
      this.currentTimeoutId = setTimeout(() => {
        this.visivel.set(false);
      }, duracion);

    } else {
        this.visivel.set(false);
    }
  }
}


// @Component({
//   selector: 'omla-pe',
//   standalone: true,
//   templateUrl: './pe.component.html',
//   styleUrls: ['./pe.component.scss'],
//   animations: [trigger('amosarOcultarMensagem', [
//       state('amosando', style({
//         height: '29px'
//       })),
//       state('ocultando', style({
//         height: '0px'
//       })),
//       transition('amosando => ocultando', [  // Aparece
//         animate('0.4s')
//       ]),
//       transition('ocultando => amosando', [  // Oculta-se
//         animate('0.08s')
//       ]),
//     ]),
//   ],
// })
// export class PeComponent implements OnInit {

//   visivel = false;
//   tipos = InformacomPeTipo;
//   tipo = InformacomPeTipo.Info;
//   mensagemPadrom = 'Informaçom da web';
//   mensagem = this.mensagemPadrom;
//   timeOutIDs:number[] = [];

//   constructor(private layoutService: LayoutService) { }

//   ngOnInit(): void {
//     this.layoutService.getInformacom().subscribe((info: InformacomPe | undefined) => {
//       this.amosar(info);
//     });
//   }

//   private async amosar(info: InformacomPe | undefined) {
//     if (info) {
//       this.tipo = info.tipo;
//       this.mensagem = info.mensagem;
//       //if (this.tipo != InformacomPeTipo.Info) {
//         this.visivel = true;
//         if (info.duracom)
//           await this.pausa(info.duracom * 1000);
//         else
//           await this.pausa(5000);
//         this.visivel = false;
//       //}
//     }
//     else
//       this.visivel = false;
//   }

//   /**
//    * Realiza umha pausa do tempo passado.
//    * @param ms Tempo em milisegundos.
//    */
//   private pausa(ms: number) {
//     return new Promise( resolve => {setTimeout(resolve, ms); } );
//   }
// }
