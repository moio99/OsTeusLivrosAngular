import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoColeconsComponent } from './listado-colecons/listado-colecons.component';
import { ColecomComponent } from './colecom/colecom.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoColeconsComponent },
  { path: 'colecom', component: ColecomComponent },
];

@NgModule({
  declarations: [
    ListadoColeconsComponent,
    ColecomComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
    , FormsModule, ReactiveFormsModule, MatInputModule
    , MatDatepickerModule, MatNativeDateModule, CoreModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: localStorage.getItem('UserLanguageDate') },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class ColeconsModule { }
