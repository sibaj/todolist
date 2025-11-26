import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';

import { MsalModule, MsalRedirectComponent, MsalService, MsalGuard } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './auth-config';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    TodoListComponent,
    MsalModule.forRoot(new PublicClientApplication(msalConfig), {
      interactionType: InteractionType.Redirect,
      authRequest: loginRequest,
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map()
    })
  ],
  providers: [MsalService, MsalGuard],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
