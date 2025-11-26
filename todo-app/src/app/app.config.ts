import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalInterceptor, MsalService, MsalGuard } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './auth-config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: 'MSAL_INSTANCE',
      useValue: new PublicClientApplication(msalConfig)
    },
    MsalService,
    MsalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ]
};


