import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.route').then(m => m.routes)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes-home/clientes.route').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'planos',
    loadChildren: () => import('./pages/planos-home/planos.route').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'faturas',
    loadChildren: () => import('./pages/faturas-home/faturas.route').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./pages/relatorio-faturas/relatorio.route').then(m => m.routes),
    canActivate: [AuthGuard]
  }
];
