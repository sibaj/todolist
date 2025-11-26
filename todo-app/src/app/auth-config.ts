import { ApplicationConfig } from '@angular/core';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalInterceptorConfiguration, MsalService } from '@azure/msal-angular';
import { Configuration, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91', // replace with your Azure AD app client id
    authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b', // replace with your tenant id or common
    redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net'//'http://localhost:4200'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91',
      authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b',
      redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net',
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
  };
}

export function initializeMsalInstance() {
  return new PublicClientApplication({
    auth: {
      clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91',
      authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b',
      redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: initializeMsalInstance,
    },
    MsalService,
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
      } as MsalGuardConfiguration,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map<string, string[]>([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']]
        ])
      } as MsalInterceptorConfiguration,
    }
  ]
};