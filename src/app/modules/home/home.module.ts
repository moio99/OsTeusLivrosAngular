import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    EstadisticasComponent
  ],
  imports: [
    CommonModule, CoreModule
  ]
})
export class HomeModule { }
