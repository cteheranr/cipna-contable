import { NavbarInterface } from '../../models/navbar.interfaces';

export const navbarData: NavbarInterface[] = [
  {
    routerLink: 'inicio',
    icon: 'bx bx-home',
    label: 'Dashboard',
    active: false,
  },
  {
    routerLink: 'estudiantes',
    icon: 'bx bx-user',
    label: 'Estudiantes',
    active: false,
  },
  {
    routerLink: 'cartera',
    icon: 'bx bx-wallet-note',
    label: 'Ventas',
    active: false,
  },
  {
    routerLink: 'egresos',
    icon: 'bx bx-print-dollar',
    label: 'Egresos',
    active: false,
  },
  {
    routerLink: 'productos',
    icon: 'bx bx-package',
    label: 'Productos',
    active: false,
  },
  {
    routerLink: 'reportes',
    icon: 'bx bx-file-report',
    label: 'Reportes',
    active: false,
  },
  {
    routerLink: 'setting',
    icon: 'bx bx-cog',
    label: 'Configuracion',
    active: false,
  },
];
