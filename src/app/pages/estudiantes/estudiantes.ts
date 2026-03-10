import { Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../service/estudiantes';
import { Estudiante } from '../../shared/models/estudiantes.model';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Loading } from '../../shared/components/Loading/loading';

@Component({
  selector: 'app-estudiantes',
  imports: [FormsModule, Loading],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.scss',
})
export class Estudiantes implements OnInit {
  lista: Estudiante[] = [];
  listaLocal: Estudiante[] = [];

  paginaActual = 1;
  tamanoPagina = 5;

  inicio: number = 0;
  fin?: number;

  loading = true;

  studentService = inject(StudentService);

  ngOnInit() {
    this.getStudentsLocal()
  }

  getStudentsLocal() {
    const data = localStorage.getItem('estudiantes');

    if (data) {
      this.listaLocal = JSON.parse(data);
      this.loading = false;
    }
    else {
      this.getStudents();
    }
  }
  async getStudents() {
    const data = await firstValueFrom(this.studentService.getStudents());
    this.lista = data;
    this.subirEnMemoriaEst();
  }

  actualizarEst(){
    this.getStudents();
  }

  subirEnMemoriaEst() {
    localStorage.setItem('estudiantes', JSON.stringify(this.lista));
    this.getStudentsLocal();
  }

  getEstudiantesPaginados() {
    this.inicio = (this.paginaActual - 1) * this.tamanoPagina;
    this.fin = this.inicio + this.tamanoPagina;
    return this.listaLocal.slice(this.inicio, this.fin);
  }

  get totalPaginas() {
    return Math.ceil(this.listaLocal.length / this.tamanoPagina);
  }

  avanzarPagina() {
    this.paginaActual++;
  }
}
