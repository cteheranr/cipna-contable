import { NavbarInterface } from '../../shared/models/navbar.interfaces';

export const navIcons: NavbarInterface[] = [
  {
    routerLink: 'facturas',
    icon: 'bx bx-file-detail',
    label: 'Factura de Ventas',
    active: false,
  },
  {
    routerLink: 'pensiones',
    icon: 'bx bx-dashboard',
    label: 'Control de pensiones',
    active: false,
  },
  {
    routerLink: 'acuerdos',
    icon: 'bx bx-credit-card-alt',
    label: 'Acuerdos de pago',
    active: false,
  },
  {
    routerLink: 'libros',
    icon: 'bx bx-book',
    label: 'Ventas de libros',
    active: false,
  },
  {
    routerLink: 'uniformes',
    icon: 'bx bx-t-shirt',
    label: 'Uniformes',
    active: false,
  },
];
