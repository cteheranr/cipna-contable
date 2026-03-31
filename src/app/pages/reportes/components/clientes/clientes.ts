import { Component, inject, OnInit } from '@angular/core';
import { Construccion } from '../../../../shared/components/construccion/construccion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../../service/estudiantes';
import { Estudiante } from '../../../../shared/models/estudiantes.model';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  
  private studentService: StudentService = inject(StudentService);

  terminoBusqueda: string = '';
  listaLocal: Estudiante[] = [];
  resultadosBusqueda: any[] = [];
  clienteSeleccionado: any = null;
  historial: any[] = [];
  stats = { totalVentas: 0, totalPagado: 0 };

  ngOnInit(): void {
    this.getStudentsLocal();
  }

  getStudentsLocal() {
    const data = localStorage.getItem('estudiantes');

    if (data) {
      this.listaLocal = JSON.parse(data);
    }
  }

  buscarEstudiante() {
    console.log('Prueba', this.listaLocal)
    if (this.terminoBusqueda.length > 2) {
      this.resultadosBusqueda = this.listaLocal.filter(
        (e) =>
          e.nombres.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
          e.numeroDocumento.toString().includes(this.terminoBusqueda) ||
          e.apellidos.toLowerCase().includes(this.terminoBusqueda.toLowerCase()),
      ).slice(0, 5);;
    } else {
      this.resultadosBusqueda = [];
    }
  }

  seleccionarEstudiante(est: any) {
    this.clienteSeleccionado = est;
    this.resultadosBusqueda = [];
    this.terminoBusqueda = `${est.nombres} ${est.apellidos}`;
    this.cargarHistorial(est.id);
  }

  cargarHistorial(clienteId: string) {
    // Simulación de carga de datos de Firebase
    this.historial = [
      {
        id: '1',
        fecha: new Date(),
        numeroPedido: '01725',
        tipo: 'Uniformes',
        total: 180000,
        pagado: 90000,
      },
      {
        id: '2',
        fecha: new Date('2026-02-15'),
        numeroPedido: '01650',
        tipo: 'Libros',
        total: 120000,
        pagado: 120000,
      },
    ];
    this.calcularStats();
  }

  calcularStats() {
    this.stats.totalVentas = this.historial.reduce((acc, curr) => acc + curr.total, 0);
    this.stats.totalPagado = this.historial.reduce(
      (acc, curr) => acc + curr.total - (curr.total - curr.pagado),
      0,
    );
  }

  exportarPDF() {
    console.log('Generando PDF para:', this.clienteSeleccionado.nombres);
    // Aquí integrarías una librería como jsPDF o llamarías a tu servicio de reportes
  }
}
