import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

import {
  PublicClientApplication,
  InteractionType
} from '@azure/msal-browser';

import { TodoListComponent } from './todo-list/todo-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// MSAL INSTANCE
export function MSALInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '64d6a144-d25d-45b2-ae5d-f22b6cd45f91',
      authority: 'https://login.microsoftonline.com/801949e9-b44a-44cc-b66c-4081418c9d5b',
      redirectUri: 'https://victorious-sea-001e1471e.3.azurestaticapps.net',
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

// GUARD CONFIG (NO FACTORY)
export const MSALGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,
};

// INTERCEPTOR CONFIG
export const MSALInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    ['https://graph.microsoft.com/v1.0/me', ['User.Read']]
  ])
};

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,  

    MsalModule.forRoot(
      MSALInstanceFactory(),
      MSALGuardConfig,
      MSALInterceptorConfig
    )
  ],
  providers: [
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
