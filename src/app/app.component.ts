import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LayoutService } from './core/services/flow/layout.service';
import { UsuarioAppService } from './core/services/flow/usuario-app.service';

@Component({
  selector: 'app-root',
  templateUrl: `app.component.html`,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild('panelMenuLayout') panelRef!: MatSidenav;

  constructor(
    private layoutService: LayoutService,
    private appUserService: UsuarioAppService) { }

  ngOnInit(): void {
    this.appUserService.setInformacom();
    this.layoutService.getAbrirMenu().subscribe(() => this.panelRef.open());
    this.layoutService.getCerrarMenu().subscribe(() => this.panelRef.close());
  }
}
