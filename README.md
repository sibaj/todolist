# Angular Todo App with MSAL Login

This repository contains instructions and example code to create an Angular Todo application that uses Microsoft Authentication Library (MSAL) for login (Azure AD / Microsoft Entra). The workspace currently only includes this README; follow the steps below to scaffold a full Angular app and integrate MSAL.

## Overview
- Frontend: Angular (CLI-generated app)
- Authentication: `@azure/msal-browser` + `@azure/msal-angular`
- Todo storage: `localStorage` (simple, no backend required)

This README provides:
- CLI commands to scaffold the Angular app
- Dependency install commands
- Example `src/app` files (MSAL config, AppModule, components, service, routing)
- How to run and test the app

---

## Prerequisites
- Node.js 18+ and `npm` installed
- (Optional) `@angular/cli` installed globally for convenience

If you don't have the Angular CLI globally installed, you can use `npx @angular/cli` instead.

## 1) Scaffold the Angular project
Run these commands in a terminal where you want the project folder created:

```bash
npm install -g @angular/cli            # optional, or use npx below
ng new todo-app --routing --style=scss --strict
cd todo-app
```

Or with npx (no global CLI install):

```bash
npx @angular/cli new todo-app -- --routing --style=scss --strict
cd todo-app
```

## 2) Install MSAL dependencies

```bash
npm install @azure/msal-browser @azure/msal-angular
```

## 3) Azure AD / Microsoft Entra setup (brief)
1. Register an application in the Azure portal (Azure Active Directory -> App registrations -> New registration).
2. Note the `Application (client) ID` and `Directory (tenant) ID`.
3. Add a redirect URI of type "Single-page application (SPA)" pointing to `http://localhost:4200` (for development).
4. Optionally grant API permissions (e.g., `User.Read`) and `Expose an API` if you have a backend.

Replace the placeholder values in the code below with your app's `clientId` and `tenantId`.

## 4) Example application files
Below are example source files you can copy into `src/app/`. They are minimal but functional for local development.

-- `src/app/auth-config.ts` --
```ts
import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // <-- replace
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // <-- replace
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
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};
```

-- `src/app/app.module.ts` --
```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MsalModule, MsalRedirectComponent, MsalService, MsalGuard, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalInterceptor, MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './auth-config';

import { TodoListComponent } from './todo-list/todo-list.component';
import { FormsModule } from '@angular/forms';

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
  const protectedResourceMap = new Map<string, Array<string>>();
  // Example: protect API endpoints if you have them
  // protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['User.Read']);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

@NgModule({
  declarations: [AppComponent, TodoListComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, MsalModule.forRoot(MSALInstanceFactory(), MSALGuardConfigFactory(), MSALInterceptorConfigFactory())],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
```

-- `src/app/app-routing.module.ts` --
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoListComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: 'todos' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

-- `src/app/app.component.ts` --
```ts
import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  template: `
    <div class="app">
      <header>
        <h1>Todo App</h1>
        <div class="auth">
          <span *ngIf="account">Welcome, {{ account.name }}!</span>
          <button *ngIf="!account" (click)="login()">Login</button>
          <button *ngIf="account" (click)="logout()">Logout</button>
        </div>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`.app { padding: 1rem } header { display:flex; justify-content:space-between; align-items:center }`],
})
export class AppComponent {
  account: AccountInfo | null = null;

  constructor(private msalService: MsalService) {
    const accounts = this.msalService.instance.getAllAccounts();
    this.account = accounts.length > 0 ? accounts[0] : null;
    this.msalService.instance.handleRedirectPromise().then((res) => {
      const a = this.msalService.instance.getAllAccounts();
      this.account = a.length > 0 ? a[0] : null;
    });
  }

  login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.msalService.logoutRedirect();
  }
}
```

-- `src/app/todo-list/todo-list.component.ts` --
```ts
import { Component, OnInit } from '@angular/core';

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-todo-list',
  template: `
    <section>
      <h2>Your Todos</h2>
      <form (submit)="add()">
        <input [(ngModel)]="newTitle" name="title" placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        <li *ngFor="let t of todos">
          <label>
            <input type="checkbox" [(ngModel)]="t.done" (change)="save()" />
            <span [style.textDecoration]="t.done ? 'line-through' : 'none'">{{ t.title }}</span>
          </label>
          <button (click)="remove(t.id)">Remove</button>
        </li>
      </ul>
    </section>
  `,
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  newTitle = '';

  ngOnInit(): void {
    this.load();
  }

  load() {
    try {
      this.todos = JSON.parse(localStorage.getItem('todos') || '[]');
    } catch {
      this.todos = [];
    }
  }

  save() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.todos.push({ id: Date.now().toString(36), title: this.newTitle.trim(), done: false });
    this.newTitle = '';
    this.save();
  }

  remove(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.save();
  }
}
```

Note: create `src/app/todo-list` folder and place `todo-list.component.ts` there. You can also add an HTML/CSS file if you prefer separating template/styles.

## 5) Run the app

```bash
ng serve --open
```

Go to `http://localhost:4200`. Click `Login` to authenticate with Azure AD. After successful authentication you'll be redirected back and the `/todos` route is protected by the MSAL guard.

## 6) Next steps and options
- Replace `'YOUR_CLIENT_ID'` and `'YOUR_TENANT_ID'` in `auth-config.ts`.
- If you prefer popup login use `loginPopup()` rather than `loginRedirect()` and adjust `InteractionType.Popup` in guard config.
- To persist todos to a backend, implement an API and configure `protectedResourceMap` to request access tokens for that API.

## Want me to scaffold the app inside this repository?
I can automatically scaffold the Angular app and add the files shown above into this workspace. Tell me if you want me to:
- run `ng new` and create the project inside `/workspaces/todolist/todo-app` and add the example source files, or
- just add the sample `src/app` files to an existing Angular app you already have.

---

If you want me to scaffold the project here now, reply with "Scaffold in repo" and I'll start (I will need to run the Angular CLI and modify files in this workspace).
# todolist