export interface NavbarInterface {
    routerLink: string;
    icon?: string,
    label: string,
    active: boolean,
    expanded?: boolean;
    items?: NavbarInterface[];
}