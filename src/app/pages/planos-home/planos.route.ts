import { Routes } from "@angular/router";
import { PlanosHomeComponent } from "./planos-home.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: PlanosHomeComponent
  }
];
