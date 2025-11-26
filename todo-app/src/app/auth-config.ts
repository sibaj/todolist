import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91', // replace with your Azure AD app client id
    authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b', // replace with your tenant id or common
    redirectUri: window.location.origin,
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
