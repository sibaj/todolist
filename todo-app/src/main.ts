import { PublicClientApplication } from '@azure/msal-browser';
import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';
import { msalConfig } from './app/auth-config';


export const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();


platformBrowser()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
