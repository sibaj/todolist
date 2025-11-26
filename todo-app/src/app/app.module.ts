import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MsalModule, MsalService, MsalGuard, MsalBroadcastService, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest, initializeMsalInstance } from './auth-config';

export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MsalModule.forRoot(MSALInstanceFactory(), {
      interactionType: InteractionType.Redirect,
      authRequest: loginRequest,
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map()
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalInstance,
      deps: [MsalService],
      multi: true
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
