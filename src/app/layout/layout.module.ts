import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent, MenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule, // Para que funcionen os elementos a
    MatIconModule,
    MatSidenavModule, /* para o menú despregavel */
  ],
  exports: [
    HeaderComponent, MenuComponent
  ]
})
export class LayoutModule { }
