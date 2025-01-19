import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from './loyout/menu/menu.component';
import { HeaderComponent } from './loyout/header/header.component';
import { PeComponent } from './core/components/pe/pe.component';
import { LayoutService } from './core/services/flow/layout.service';
import { UsuarioAppService } from './core/services/flow/usuario-app.service';
import { CommonModule } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { AdaptadorDaData } from './shared/classes/adaptador-data';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, CommonModule
    , MenuComponent, HeaderComponent, PeComponent, NgApexchartsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: AdaptadorDaData },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
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
