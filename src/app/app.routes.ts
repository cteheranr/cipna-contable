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
import { CarteraMenu } from './pages/cartera/components/cartera-menu/cartera-menu';
import { Facturas } from './pages/cartera/components/facturas/facturas';
import { Pensiones } from './pages/cartera/components/pensiones/pensiones';
import { Acuerdos } from './pages/cartera/components/acuerdos/acuerdos';
import { Libros } from './pages/cartera/components/libros/libros';
import { Uniformes } from './pages/cartera/components/uniformes/uniformes';
import { Diario } from './pages/reportes/components/diario/diario';
import { Efectivo } from './pages/reportes/components/efectivo/efectivo';
import { Clientes } from './pages/reportes/components/clientes/clientes';
import { Mensual } from './pages/reportes/components/mensual/mensual';
import { Report } from './pages/reportes/components/report/report';
import { Egresos } from './pages/egresos/egresos';
import { RepUniformes } from './pages/reportes/components/uniformes/uniformes';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard],
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
        children: [
          {
            path: '',
            component: CarteraMenu,
          },
          {
            path: 'facturas',
            component: Facturas,
          },
          {
            path: 'pensiones',
            component: Pensiones,
          },
          {
            path: 'acuerdos',
            component: Acuerdos,
          },
          {
            path: 'libros',
            component: Libros,
          },
          {
            path: 'uniformes',
            component: Uniformes,
          },
        ],
      },
      {
        path: 'egresos',
        component: Egresos,
      },
      {
        path: 'productos',
        component: Productos,
      },
      {
        path: 'reportes',
        component: Reportes,
        children: [
          {
            path: '',
            component: Report,
          },
          {
            path: 'diario',
            component: Diario,
          },
          {
            path: 'efectivo',
            component: Efectivo,
          },
          {
            path: 'por-cliente',
            component: Clientes,
          },
          {
            path: 'mensual',
            component: Mensual,
          },
          {
            path: 'report-uniforme',
            component: RepUniformes,
          },
        ]
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
