import { provideRouter, Routes } from '@angular/router';
import { EstadisticasComponent } from './pages/home/estadisticas/estadisticas.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { LayoutBaleiroComponent } from './layouts/layout-baleiro/layout-baleiro.component';
import { LayoutPrincipalComponent } from './layouts/layout-principal/layout-principal.component';

export const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full', title: 'OTL - login' },
  {
    path: 'login',
    component: LayoutBaleiroComponent,
    children: [{ path: '', component: LoginComponent }]
  },
  // { path: 'login', component: LoginComponent, title: 'OTL - Login' },
  {
    path: '',
    component: LayoutPrincipalComponent,
    children: [
      { path: 'estadisticas', component: EstadisticasComponent, title: 'OTL - Estadísticas', canActivate: [authGuard] },
      /* { path: 'livros', title: 'OTL - livros'
        , loadComponent: () => import('./../app/pages/livros/listado-livros/listado-livros.component')
          .then(m => m.ListadoLivrosComponent) }, */
      {
        path: 'graficos', title: 'OTL - Gráficos',
        loadChildren: () => import('./../app/pages/graficos/anos-paginas-idiomas/anos-paginas-idiomas.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'livros', title: 'OTL - livros',
        loadChildren: () => import('./../app/pages/livros/listado-livros/listado-livros.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'autores', title: 'OTL - Autores',
        loadChildren: () => import('./../app/pages/autores/listado-autores/listado-autores.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'editoriais', title: 'OTL - Editoriais',
        loadChildren: () => import('./../app/pages/editoriais/listado-editoriais/listado-editoriais.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'generos', title: 'OTL - Géneros',
        loadChildren: () => import('./../app/pages/generos/listado-generos/listado-generos.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'bibliotecas', title: 'OTL - Bibliotecas',
        loadChildren: () => import('./../app/pages/bibliotecas/listado-bibliotecas/listado-bibliotecas.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'colecons', title: 'OTL - Coleçons',
        loadChildren: () => import('./../app/pages/colecons/listado-colecons/listado-colecons.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
      {
        path: 'estilos-literarios', title: 'OTL - Estilo Literario',
        loadChildren: () => import('./../app/pages/estilos-literarios/listado-estilos-literarios/listado-estilos-literarios.component')
          .then(m => m.childRoutes),
        canActivate: [authGuard]
      },
    ]
  }
];

export const appRootingProviders = [
  provideRouter(routes)
];
