import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '@servizosFlow';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'omla-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  private layoutService = inject(LayoutService);

  onFecharMenu(): void {
    this.layoutService.cerrarMenu();
  }
}
