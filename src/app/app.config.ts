import { ApplicationConfig } from '@angular/core';
import { appRootingProviders } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { carregandoInterceptor } from './core/interceptors/carregando.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    appRootingProviders,

    // Configuración moderna con interceptores funcionais
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,     // 1º Execútase este (engade o token)
        carregandoInterceptor // 2º Execútase este (amosa o spinner)
      ])
    )
  ]
};

// export const appConfig: ApplicationConfig = {
//   providers: [appRootingProviders, provideAnimationsAsync(),
//     // Isto o meto para que me funcione o interceptor do HTTP_INTERCEPTORS
//     provideHttpClient(
//       withInterceptorsFromDi(),
//     ),
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: CarregandoInterceptor,
//       multi: true,
//     },
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: TokenInterceptor,
//       multi: true,
//     }
//   ]
// };
