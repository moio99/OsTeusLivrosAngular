import { ApplicationConfig, isDevMode } from '@angular/core';
import { appRootingProviders } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { carregandoInterceptor } from './core/interceptors/carregando.interceptor';
import { authInterceptor, tokenInterceptor } from './core/interceptors/token.interceptor';
import { noCacheInterceptor } from './core/interceptors/no-cache.interceptor';
import { desvioJava } from './core/interceptors/desvio-java.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoMessageformat } from '@jsverse/transloco-messageformat';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración moderna con interceptores funcionais
    provideHttpClient(
      withInterceptors([
        tokenInterceptor, // 1º Execútase este (engade o token)
        authInterceptor, // 2º Se chega um 401 devio ao login
        noCacheInterceptor, // 3º Execútase este (amosa o spinner)
        desvioJava,
        carregandoInterceptor, // 4º Execútase este (amosa o spinner)
      ]),
    ),
    provideHttpClient(),
      provideTransloco({
        config: {
          availableLangs: ['gl', 'es', 'en', 'ca', 'eu'],
          defaultLang: 'gl',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader,
      }
    ),
    appRootingProviders,
    provideTranslocoMessageformat()        // para traduzir correctamente os plurais (livro -> livros, liburu -> liburuak)
  ],
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
