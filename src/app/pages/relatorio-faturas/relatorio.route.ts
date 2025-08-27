import { Routes } from "@angular/router";
import { RelatorioFaturasComponent } from "./relatorio-faturas.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: RelatorioFaturasComponent ,
  }
];
