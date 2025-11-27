import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';

export const msalConfig = {
  auth: {
    clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91', // your clientId
    authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b', // your tenant
    redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net', // your deployed URL
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const protectedResourceMap: Map<string, string[]> = new Map([
  ['https://graph.microsoft.com/v1.0/me', ['User.Read']],
]);

export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
