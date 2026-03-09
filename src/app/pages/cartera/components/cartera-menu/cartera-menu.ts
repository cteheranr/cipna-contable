import { Component } from '@angular/core';
import { navIcons } from '../../card-data';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cartera-menu',
  imports: [NgClass, RouterLink],
  templateUrl: './cartera-menu.html',
  styleUrl: './cartera-menu.scss',
})
export class CarteraMenu {

  navIcons = navIcons;

}
