import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoEditoriaisComponent } from './listado-editoriais/listado-editoriais.component';
import { EditorialComponent } from './editorial/editorial.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CoreModule } from 'src/app/core/core.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListadoEditoriaisComponent },
  { path: 'editorial', component: EditorialComponent },
];

@NgModule({
  declarations: [
    ListadoEditoriaisComponent,
    EditorialComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, MatInputModule, CoreModule
  ]
})
export class EditoriaisModule { }
