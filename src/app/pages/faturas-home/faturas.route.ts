import { Routes } from "@angular/router";
import { FaturasHomeComponent } from "./faturas-home.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: FaturasHomeComponent ,
  }
];



