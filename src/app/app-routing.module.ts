import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EstadisticasComponent } from './modules/home/estadisticas/estadisticas.component';

const routes: Routes = [
  { path: '', redirectTo:'estadisticas', pathMatch:'full', title: 'sfsd' },
  { path: 'estadisticas', component: EstadisticasComponent, title: 'OTL - Estadísticas' },
  { path: 'livros', title: 'OTL - Livros', loadChildren: () => import('./modules/livros/livros.module').then(m => m.LivrosModule) },
  { path: 'autores', title: 'OTL - Autores', loadChildren: () => import('./modules/autores/autores.module').then(m => m.AutoresModule) },
  { path: 'editoriais', title: 'OTL - Editoriais', loadChildren: () => import('./modules/editoriais/editoriais.module').then(m => m.EditoriaisModule) },
  { path: 'generos', title: 'OTL - Géneros', loadChildren: () => import('./modules/generos/generos.module').then(m => m.GenerosModule) },
  { path: 'bibliotecas', title: 'OTL - Bibliotecas', loadChildren: () => import('./modules/bibliotecas/bibliotecas.module').then(m => m.BibliotecasModule) },
  { path: 'colecons', title: 'OTL - Coleçons', loadChildren: () => import('./modules/colecons/colecons.module').then(m => m.ColeconsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
