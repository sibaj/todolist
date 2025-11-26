import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('todo-app');
  account: AccountInfo | null = null;

  pills = [
    { title: 'Explore the Docs', link: 'https://angular.dev' },
    { title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials' },
    { title: 'Prompt and best practices for AI', link: 'https://angular.dev/ai/develop-with-ai' },
    { title: 'CLI Docs', link: 'https://angular.dev/tools/cli' },
    { title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service' },
    { title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools' }
  ];

  constructor(private msalService: MsalService) {
    const accounts = this.msalService.instance.getAllAccounts();
    this.account = accounts.length > 0 ? accounts[0] : null;
    this.msalService.instance.handleRedirectPromise().then(() => {
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

  getTitle() {
    return this.account?.name ?? 'Angular App';
  }
}

