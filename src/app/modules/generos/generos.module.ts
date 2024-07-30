import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { GeneroComponent } from './genero/genero.component';
import { ListadoGenerosComponent } from './listado-generos/listado-generos.component';
import { CoreModule } from 'src/app/core/core.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoGenerosComponent },
  { path: 'genero', component: GeneroComponent },
];

@NgModule({
  declarations: [
    ListadoGenerosComponent, GeneroComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule, MatInputModule, CoreModule
  ]
})
export class GenerosModule { }
