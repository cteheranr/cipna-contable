export interface NavbarInterface {
    routerLink: string,
    detalle?: string,
    icon?: string,
    label: string,
    active: boolean,
    expanded?: boolean;
    items?: NavbarInterface[];
}