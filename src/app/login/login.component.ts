import { Component } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { createToast } from 'vercel-toast';

const poolData = {
    UserPoolId: environment.cognito.userPoolId,
    ClientId: environment.cognito.userPoolWebClienId,
    Region: 'us-east-1' // Asegúrate de especificar la región correcta si es diferente
};

const userPool = new CognitoUserPool(poolData);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(private router: Router) { }

  async login(username: string, password: string) {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    const userData = {
      Username: username,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          // El usuario ha iniciado sesión correctamente
          resolve(result);
        },
        onFailure: (err) => {
          // Error en el inicio de sesión
          reject(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          // Si se requiere una nueva contraseña, se debe manejar aquí
          // Esto ocurre cuando se configura la autenticación multifactor o cuando el usuario debe cambiar su contraseña inicial
          resolve({ newPasswordRequired: true, userAttributes, requiredAttributes });
        }
      });
    });
  }

  iniciar() {
    if (!this.usuario || !this.password) {
      createToast('Por favor, ingresa tu usuario y contraseña para iniciar sesión.', { type: 'error' });
      return;
    }

    console.log("Intento de inicio de sesión para el usuario:", this.usuario);
    // No mostrar la contraseña en la consola por razones de seguridad
    this.login(this.usuario, this.password)
      .then(result => {
        console.log('Inicio de sesión exitoso'); // No mostramos datos sensibles en la consola
        // Redireccionar a la página de inicio o realizar otras acciones necesarias después del inicio de sesión exitoso
        this.router.navigate(['/home']);
        createToast('Inicio de sesión exitoso', { type: 'success' });
      })
      .catch(error => {
        console.error('Error en el inicio de sesión:', error); // Mostrar mensaje de error al usuario o realizar otras acciones necesarias en caso de error
        createToast('Error en el inicio de sesión', { type: 'error' });
      });
  }
}