import { NavbarInterface } from '../../shared/models/navbar.interfaces';

export const navIcons: NavbarInterface[] = [
  {
    routerLink: 'facturas',
    detalle: 'Generación de recibos de caja y comprobantes.',
    icon: 'bx bx-file-detail',
    label: 'Recibo de Ventas',
    active: false,
  },
  {
    routerLink: 'pensiones',
    detalle: 'Seguimiento de mensualidades por estudiante.',
    icon: 'bx bx-dashboard',
    label: 'Control de Pensiones',
    active: false,
  },
  {
    routerLink: 'acuerdos',
    detalle: 'Gestión de deudas y convenios institucionales.',
    icon: 'bx bx-credit-card-alt',
    label: 'Acuerdos de Pago',
    active: false,
  },
  {
    routerLink: 'libros',
    detalle: 'Inventario y despacho de material académico.',
    icon: 'bx bx-book',
    label: 'Ventas de Libros',
    active: false,
  },
  {
    routerLink: 'uniformes',
    detalle: 'Inventario y despacho de uniformes estudiantiles.',
    icon: 'bx bx-t-shirt',
    label: 'Uniformes',
    active: false,
  },
];
