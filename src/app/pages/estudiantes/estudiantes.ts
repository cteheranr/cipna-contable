import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../service/estudiantes';
import { Estudiante } from '../../shared/models/estudiantes.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estudiantes',
  imports: [FormsModule],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.scss',
})
export class Estudiantes implements OnInit {
  lista: Estudiante[] = [];
  inicio: number = 0;
  fin?: number;

  constructor(private estudiantesSrv: EstudiantesService) {}

  ngOnInit() {
    this.estudiantesSrv.getStudens()
  }

  paginaActual = 1;
  tamanoPagina = 5;

  get estudiantesPaginados() {
    if (typeof this.tamanoPagina === 'string') {
      this.tamanoPagina = parseInt(this.tamanoPagina);
    }
    this.inicio = (this.paginaActual - 1) * this.tamanoPagina;
    this.fin = this.inicio + this.tamanoPagina;
    console.log('inicio', this.inicio, 'FIN', this.fin);
    return this.lista.slice(this.inicio, this.fin);
  }

  get totalPaginas() {
    return Math.ceil(this.lista.length / this.tamanoPagina);
  }

  avanzarPagina() {
    this.paginaActual = this.paginaActual + 1;
  }

}
