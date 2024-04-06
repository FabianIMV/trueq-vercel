import { Component, OnInit } from '@angular/core';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';

const poolData = {
  UserPoolId: environment.cognito.userPoolId,
  ClientId: environment.cognito.userPoolWebClienId,
  Region: 'us-east-2'
};

const userPool = new CognitoUserPool(poolData);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userAttributes: any;

  constructor() {}

  ngOnInit() {
    const cognitoUser = userPool.getCurrentUser();
  
    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
  
        cognitoUser.getUserAttributes((err: any, result: any) => {
          if (err) {
            alert(err.message || JSON.stringify(err));
            return;
          }
  
          if (result) {
            const attributes: Record<string, any> = {};
            for (let attribute of result) {
              attributes[attribute.getName()] = attribute.getValue();
            }
            this.userAttributes = attributes;
          }
        });
      });
    }
  }

  logout() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }
}