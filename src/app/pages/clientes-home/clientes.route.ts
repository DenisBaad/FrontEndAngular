import { Routes } from '@angular/router';
import { ClientesHomeComponent } from './clientes-home.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: ClientesHomeComponent,
  }
];
