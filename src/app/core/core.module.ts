import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstrelasPontuacomComponent } from './components/estrelas-pontuacom/estrelas-pontuacom.component';
import { EstrelaComponent } from './components/estrelas-pontuacom/estrela/estrela.component';
import { MultiSelecomDialogComponent } from './components/multi-selecom-dialog/multi-selecom-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OrdeColunaComponent } from './components/orde-coluna/orde-coluna.component';
import { FiltroListDragPipe } from '../shared/pipes/filtro-list-drag.pipe';
import { FormsModule } from '@angular/forms';
import { PeComponent } from './components/pe/pe.component';

@NgModule({
  declarations: [
    EstrelasPontuacomComponent, EstrelaComponent, MultiSelecomDialogComponent, FiltroListDragPipe,
    OrdeColunaComponent, PeComponent
  ],
  imports: [
    CommonModule,
    DragDropModule, /* para a multi-selecom */
    FormsModule,    /* para meter o [(ngModel)] */
  ],
  exports: [
    EstrelasPontuacomComponent, MultiSelecomDialogComponent, OrdeColunaComponent, PeComponent
  ]
})
export class CoreModule { }
