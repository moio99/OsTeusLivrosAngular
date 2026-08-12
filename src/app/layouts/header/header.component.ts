import { Component, inject } from '@angular/core';
import { LayoutService } from '../../core/services/flow/layout.service';
import { MatIconModule } from '@angular/material/icon';
import { CarregandoService } from '../../core/services/tools/carregando.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'omla-header',
  standalone: true,
  imports: [MatIconModule, CommonModule], // engado CommonModule para o | async do HTML
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
  protected readonly isAmosarCarregando = this.carregandoService.carregando;

  onAmosarMenu(): void {
    this.layoutService.abrirMenu();
  }
}
