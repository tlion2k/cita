import type { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'gestion',
    loadComponent: () => import('./pages/gestion/gestion.page').then((m) => m.GestionPage),
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  }
];
