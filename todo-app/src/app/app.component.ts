import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(private msal: MsalService) {}

  ngOnInit() {
    this.msal.instance.handleRedirectPromise().then(() => {
      if (!this.msal.instance.getActiveAccount()) {
        this.msal.instance.loginRedirect();
      }
    });
  }
}
