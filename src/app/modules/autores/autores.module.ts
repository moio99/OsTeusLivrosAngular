import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorComponent } from './autor/autor.component';
import { ListadoAutoresComponent } from './listado-autores/listado-autores.component';
//import { AppRoutingModule } from 'src/app/app-routing.module';
import { PorTiposComponent } from './listado-autores/por-tipos/por-tipos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoAutoresComponent },
  { path: 'autor', component: AutorComponent },
  { path: 'porNacionalidade', component: PorTiposComponent },
  { path: 'porPais', component: PorTiposComponent },
];

@NgModule({
  declarations: [
    AutorComponent,
    ListadoAutoresComponent,
    PorTiposComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes)
    , FormsModule, ReactiveFormsModule, CoreModule
    , MatInputModule
    , MatDatepickerModule, MatNativeDateModule
    , MatAutocompleteModule
    //, AppRoutingModule /* AppRoutingModule o meto para que funcionen os links a */
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
export class AutoresModule { }
