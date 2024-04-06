import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';

const poolData = {
  UserPoolId: environment.cognito.userPoolId,
  ClientId: environment.cognito.userPoolWebClienId,
  Region: 'us-east-2'
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cognitoUser = userPool.getCurrentUser();
    const loggedIn = cognitoUser != null;

    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    return loggedIn;
  }
}