import { NavbarInterface } from '../../shared/models/navbar.interfaces';

export const navIcons: NavbarInterface[] = [
  {
    routerLink: 'matricula',
    detalle: 'Generación de certificado de matricula o de estudio.',
    icon: 'bx bx-file-detail',
    label: 'Certificados de Matricula',
    active: false,
  },
  {
    routerLink: 'notas',
    detalle: 'Generación de certificado de notas.',
    icon: 'bx bx-file-code',
    label: 'Certificado de Notas',
    active: false,
  },
];
