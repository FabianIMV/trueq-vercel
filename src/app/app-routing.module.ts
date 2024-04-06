import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component'; 
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { ObjetoComponent } from './objeto/objeto.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'objeto', component: ObjetoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }