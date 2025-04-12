import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PeComponent } from '../../core/components/pe/pe.component';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { LayoutService } from '../../core/services/flow/layout.service';
import { UsuarioAppService } from '../../core/services/flow/usuario-app.service';

@Component({
  selector: 'app-layout-principal',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, CommonModule
    , MenuComponent, HeaderComponent, PeComponent, NgApexchartsModule
  ],
  templateUrl: './layout-principal.component.html',
  styleUrl: './layout-principal.component.scss'
})
export class LayoutPrincipalComponent implements OnInit {

  title = 'Os Meus Livros';

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
