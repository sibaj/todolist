import { Component, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html'
})
export class AppComponent {
  private msal = inject(MsalService);

  logout() {
    this.msal.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
  }

  login() {
    this.msal.loginRedirect();
  }

  isLoggedIn() {
    return this.msal.instance.getAllAccounts().length > 0;
  }
}
