import { Component } from '@angular/core';
import { navIcons } from './card-data';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cartera',
  imports: [RouterOutlet],
  templateUrl: './cartera.html',
  styleUrl: './cartera.scss',
})
export class Cartera {
  navIcons = navIcons;
}
