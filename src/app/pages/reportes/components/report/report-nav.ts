import { NavbarInterface } from "../../../../shared/models/navbar.interfaces";

export const navIconsReport: NavbarInterface[] = [
  {
    routerLink: 'diario',
    icon: 'bx bx-calendar-detail',
    label: 'Reporte diario',
    active: false,
  },
  {
    routerLink: 'por-cliente',
    icon: 'bx bx-dashboard',
    label: 'Reporte por Cliente',
    active: false,
  },
  // {
  //   routerLink: 'efectivo',
  //   icon: 'bx bx-credit-card-alt',
  //   label: 'Efectivo recibido',
  //   active: false,
  // },
  {
    routerLink: 'mensual',
    icon: 'bx bx-book',
    label: 'Reporte mensual',
    active: false,
  },
];
