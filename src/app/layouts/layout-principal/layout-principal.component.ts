import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PeComponent } from '@componhentesComuns';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';
import { LayoutService, UsuarioAppService } from '@servizosFlow';

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
  @ViewChild('meuContido', { read: ElementRef }) set contedorRef(element: ElementRef) {
    if (element) {
      // Gardamos o elemento HTML nativo directamente no Signal do servizo
      this.layoutService.contedorScroll.set(element.nativeElement);
    }
  }

  readonly layoutService = inject(LayoutService);
  private readonly appUserService = inject(UsuarioAppService);

  ngOnInit(): void {
    this.appUserService.setInformacom();
  }
}
