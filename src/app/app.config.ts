import { ApplicationConfig } from '@angular/core';
import { appRootingProviders } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [appRootingProviders, provideHttpClient(), provideAnimationsAsync()]
};
