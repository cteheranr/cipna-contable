import { NavbarInterface } from "../../../../shared/models/navbar.interfaces";

export const navIconsReport: NavbarInterface[] = [
  {
    routerLink: 'diario',
    icon: 'bx bx-calendar-detail',
    label: 'Reporte diario',    
    detalle: 'Reporte de ventas y egresos diarios.',
    active: false,
  },
  {
    routerLink: 'por-cliente',
    icon: 'bx bx-dashboard',
    label: 'Reporte por Cliente',
    detalle: 'Reporte de ventas por clientes.',
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
    detalle: 'Reporte de ventas y egresos por mensuales.',
    label: 'Reporte mensual',
    active: false,
  },
  {
    routerLink: 'report-uniforme',
    icon: 'bx bx-t-shirt',
    label: 'Reporte de Uniformes',
    detalle: 'Reporte de ventas de uniformes entre fechas.',
    active: false,
  },
];
