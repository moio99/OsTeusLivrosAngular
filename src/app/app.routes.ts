import { provideRouter, Routes } from '@angular/router';
import { EstadisticasComponent } from './pages/home/estadisticas/estadisticas.component';

export const routes: Routes = [
    { path: '', redirectTo:'estadisticas', pathMatch:'full', title: 'OTL - Estadísticas' },
    { path: 'estadisticas', component: EstadisticasComponent, title: 'OTL - Estadísticas' },
    /* { path: 'livros', title: 'OTL - livros'
      , loadComponent: () => import('./../app/pages/livros/listado-livros/listado-livros.component')
        .then(m => m.ListadoLivrosComponent) }, */
    {
      path: 'graficos', title: 'OTL - Gráficos',
      loadChildren: () => import('./../app/pages/graficos/anos-paginas-idiomas/anos-paginas-idiomas.component')
        .then(m => m.childRoutes) },
    {
      path: 'livros', title: 'OTL - livros',
      loadChildren: () => import('./../app/pages/livros/listado-livros/listado-livros.component')
        .then(m => m.childRoutes) },
    {
      path: 'autores', title: 'OTL - Autores',
      loadChildren: () => import('./../app/pages/autores/listado-autores/listado-autores.component')
        .then(m => m.childRoutes) },
    {
      path: 'editoriais', title: 'OTL - Editoriais',
      loadChildren: () => import('./../app/pages/editoriais/listado-editoriais/listado-editoriais.component')
        .then(m => m.childRoutes) },
    {
      path: 'generos', title: 'OTL - Géneros',
      loadChildren: () => import('./../app/pages/generos/listado-generos/listado-generos.component')
        .then(m => m.childRoutes) },
    {
      path: 'bibliotecas', title: 'OTL - Bibliotecas',
      loadChildren: () => import('./../app/pages/bibliotecas/listado-bibliotecas/listado-bibliotecas.component')
        .then(m => m.childRoutes) },
    {
      path: 'colecons', title: 'OTL - Coleçons',
      loadChildren: () => import('./../app/pages/colecons/listado-colecons/listado-colecons.component')
        .then(m => m.childRoutes) },
    {
      path: 'estilos-literarios', title: 'OTL - Estilo Literario',
      loadChildren: () => import('./../app/pages/estilos-literarios/listado-estilos-literarios/listado-estilos-literarios.component')
        .then(m => m.childRoutes) },
  ];

export const appRootingProviders = [
  provideRouter(routes)
];
