import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivroComponent } from './livro/livro.component';
import { ListadoLivrosComponent } from './listado-livros/listado-livros.component';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoLivrosComponent },
  { path: 'livro', component: LivroComponent },
];

@NgModule({
  declarations: [
    LivroComponent,
    ListadoLivrosComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), CoreModule, FormsModule, ReactiveFormsModule
    , MatInputModule, MatCheckboxModule
    , MatDatepickerModule, MatNativeDateModule
    , MatAutocompleteModule
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
export class LivrosModule { }
