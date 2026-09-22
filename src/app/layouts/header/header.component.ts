import { Component, inject } from '@angular/core';
import { LayoutService } from '@servizosFlow';
import { MatIconModule } from '@angular/material/icon';
import { CarregandoService } from '../../core/services/tools/carregando.service';

@Component({
  selector: 'omla-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  private readonly layoutService = inject(LayoutService);
  private readonly carregandoService = inject(CarregandoService);

  // protected readonly isAmosarCarregando = toSignal(
  //   this.carregandoService.carregando$,
  //   { initialValue: false } // Valor inicial por defecto
  // );
  protected readonly isAmosarCarregando = this.carregandoService.carregando;  // É um signal

  onAmosarMenu(): void {
    this.layoutService.abrirMenu();
  }
}
