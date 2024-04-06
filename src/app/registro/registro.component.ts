import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: environment.cognito.userPoolId,
  ClientId: environment.cognito.userPoolWebClienId,
  Region: 'us-east-1'
};

const userPool = new CognitoUserPool(poolData);

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  showConfirmationMessage = false;
  loading = false;
  confirmationCode = '';
  telefono = '';
  countryCode: string = '56'; // Define countryCode como string

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  passwordValid() {
    return /^(?=.*[a-z]).{8,}$/.test(this.password);
  }

  validatePassword() {
    // Verifica si el campo de contraseña está vacío
    if (!this.password) {
      this.toastr.error('Debe ingresar contraseña');
      return false;
    }

    // Verifica si la contraseña cumple con los requisitos de la política
    if (!this.passwordValid()) {
      this.errorMessage = 'La contraseña no cumple con los requisitos de la política';
      this.toastr.error(this.errorMessage, 'Error');
      return false;
    }

    return true;
  }

  async existeUsuario(email: string): Promise<boolean> {
    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise<boolean>((resolve, reject) => {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          resolve(false);
        } else {
          this.errorMessage = 'Ya existe una cuenta con este correo electrónico';
          this.toastr.error(this.errorMessage, 'Error');
          resolve(true);
        }
      });
    });
  }

  confirmarCodigo() {
    const userData = {
      Username: this.email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(this.confirmationCode, true, (err, result) => {
      if (err) {
        console.error('Error al confirmar el código:', err);
        this.toastr.error('Error al confirmar el código', 'Error');
      } else {
        console.log('Código confirmado con éxito');
        this.toastr.success('Código confirmado con éxito', 'Confirmación exitosa');
        this.router.navigate(['/login']);
      }
    });
  }

  async registrarse() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.toastr.error(this.errorMessage, 'Error');
      return;
    }

    if (!this.validatePassword()) {
      return;
    }

    const usuarioExistente = await this.existeUsuario(this.email);
    if (usuarioExistente) {
      return;
    }

    const attributeList: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'email', Value: this.email }),
      new CognitoUserAttribute({ Name: 'name', Value: this.nombre }), // Almacenar el nombre del usuario
      new CognitoUserAttribute({ Name: 'phone_number', Value: '+' + this.countryCode + this.telefono })
    ];

    this.loading = true;
    userPool.signUp(this.email, this.password, attributeList, [], (err, result) => {
      this.loading = false;
      if (err) {
        console.error('Error en el registro:', err);
        this.toastr.error('Ya existe un usuario con el correo electronico ingresado', 'Error');
      } else {
        if (result && result.user) {
          console.log('Usuario registrado con éxito:', result.user);
          this.toastr.success('Usuario registrado con éxito', 'Registro exitoso');
          this.showConfirmationMessage = true;
        } else {
          console.error('Error en el registro: No se recibió un resultado válido.');
          this.toastr.error('Error en el registro', 'Error');
        }
      }
    });
  }

  reenviarCodigo() {
    const userData = {
      Username: this.email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        console.error('Error al reenviar el código:', err);
        this.toastr.error('Error al reenviar el código', 'Error');
      } else {
        console.log('Código reenviado con éxito');
        this.toastr.success('Código reenviado con éxito', 'Reenvío exitoso');
      }
    });
  }

  navegarAlogin() {
    this.router.navigate(['/login']);
  }
}