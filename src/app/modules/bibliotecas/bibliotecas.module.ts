import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoBibliotecasComponent } from './listado-bibliotecas/listado-bibliotecas.component';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoBibliotecasComponent },
  { path: 'biblioteca', component: BibliotecaComponent },
];

@NgModule({
  declarations: [
    ListadoBibliotecasComponent,
    BibliotecaComponent
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
export class BibliotecasModule { }
