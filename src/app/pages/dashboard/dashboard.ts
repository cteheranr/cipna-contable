import { Component, inject } from '@angular/core';
import { Construccion } from '../../shared/components/construccion/construccion';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  totalEstudiantes = 450;
  recaudadoHoy = 1250000;
  carteraPendiente = 5800000;
  movimientos = [];

  private router: Router = inject(Router)

  ngOnInit() {  }

  redireccion(destino : string){
    this.router.navigate(['/app/'+destino]);
  }

}
