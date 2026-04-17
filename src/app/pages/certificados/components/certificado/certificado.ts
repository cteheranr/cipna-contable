import { Component } from '@angular/core';
import { navIcons } from '../../card-data';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-certificado',
  imports: [NgClass, RouterLink],
  templateUrl: './certificado.html',
  styleUrl: './certificado.scss',
})
export class Certificado {
  navIcons = navIcons;
}
