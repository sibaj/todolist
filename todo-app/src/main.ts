import { PublicClientApplication } from '@azure/msal-browser';
import { AppModule } from './app/app.module';
import { platformBrowser } from '@angular/platform-browser';
import { msalConfig } from './app/auth-config';


platformBrowser()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err));
