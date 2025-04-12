import { ApplicationConfig } from '@angular/core';
import { appRootingProviders } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CarregandoInterceptor } from './core/interceptors/carregando.interceptor';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [appRootingProviders, provideAnimationsAsync(),
    // Isto o meto para que me funcione o interceptor do HTTP_INTERCEPTORS
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CarregandoInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ]
};
