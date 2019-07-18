import * as Msal from 'msal';

export default class AuthService {
  constructor() {
    let PROD_REDIRECT_URI = 'http://localhost:8080/auth';
    let redirectUri = window.location.origin;
    if (window.location.hostname !== '127.0.0.1') {
      redirectUri = PROD_REDIRECT_URI;
    }
    this.applicationConfig = {
      clientID: '39438c0e-ebd5-4d1b-80ca-c45a6d37b2f1',
      redirectUri,
      authority: 'https://login.microsoftonline.com/78878888-d4f9-4c6e-8891-0205364a18a4',
      cacheLocation: 'localStorage',
      graphScopes: ['user.read'],
    };
    this.app = new Msal.UserAgentApplication(
      this.applicationConfig.clientID,
      this.applicationConfig.authority,
      () => {
        // callback for login redirect
      },
      {
        redirectUri,
      }
    );
  }
  login() {
    return this.app.loginPopup(this.applicationConfig.graphScopes).then(
      idToken => {
        const user = this.app.getUser();
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      () => {
        return null;
      }
    );
  };
  logout() {
    this.app.logout();
  };
  getToken() {
    return this.app.acquireTokenSilent(this.applicationConfig.graphScopes).then(
      accessToken => {
        return accessToken;
      },
      error => {
        return this.app
          .acquireTokenPopup(this.applicationConfig.graphScopes)
          .then(
            accessToken => {
              return accessToken;
            },
            err => {
              console.error(err);
            }
          );
      }
    );
  };
}
