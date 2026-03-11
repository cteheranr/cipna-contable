import { Component, inject } from '@angular/core';
import { Construccion } from '../../shared/components/construccion/construccion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  totalEstudiantes = 450;
  recaudadoHoy = 1250000;
  carteraPendiente = 5800000;
  movimientos = [];

  ngOnInit() {
    // Aquí llamarías a un StudentService y BillingService
  }
}
