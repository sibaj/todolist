import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91',
    authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b',
    redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ['User.Read']
};
