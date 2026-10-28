import { Component, OnInit, inject } from '@angular/core';
import { AuthService, LayoutService } from '@servizosFlow';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'omla-menu',
  standalone: true,
  imports: [RouterModule, TranslocoPipe],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private readonly translocoService = inject(TranslocoService);

  onFecharMenu(): void {
    this.layoutService.cerrarMenu();
  }

  onSair(): void {
    this.authService.logout();
    this.layoutService.cerrarMenu();
  }

  troco(idioma: string): void {
    this.translocoService.setActiveLang(idioma);
  }
}
