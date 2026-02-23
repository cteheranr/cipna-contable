import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Estudiantes } from './pages/estudiantes/estudiantes';
import { Cartera } from './pages/cartera/cartera';
import { Productos } from './pages/productos/productos';
import { Reportes } from './pages/reportes/reportes';
import { Configuracion } from './pages/configuracion/configuracion';
import { authGuard } from './shared/guards/auth/auth.guard';
import { publicGuard } from './shared/guards/public/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard]
  },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'inicio',
        component: Dashboard,
      },
      {
        path: 'estudiantes',
        component: Estudiantes,
      },
      {
        path: 'cartera',
        component: Cartera,
      },
      {
        path: 'productos',
        component: Productos,
      },
      {
        path: 'reportes',
        component: Reportes,
      },
      {
        path: 'setting',
        component: Configuracion,
      },
    ],
  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/app/inicio', pathMatch: 'full' },
];
