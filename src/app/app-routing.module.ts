import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component'; 
import { HOMEComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { OBJETOComponent } from './objeto/objeto.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HOMEComponent, canActivate: [AuthGuard] },
  { path: 'objeto', component: OBJETOComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }