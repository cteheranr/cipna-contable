import { Component, inject } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NotificationService } from '../../../../service/notificaciones/notificaciones';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matricula',
  imports: [FormsModule, CommonModule],
  templateUrl: './matricula.html',
  styleUrl: './matricula.scss',
})
export class Matricula {
  tipoCertificado = 'matricula';
  display : boolean = false;
  gradoEstudiante : string = '0';
  sexoEstudiante : 'Fem' | 'Mas' | null = 'Mas'
  anioLectivo = '2026';
  estudianteSeleccionado: Estudiante | null = null;
  estudiantesFiltradosAux: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  private notifService = inject(NotificationService);
  busqueda = '';
  fechaHoy = new Date();

  mostrarVista() {
    console.log("gradoEstudiante", typeof this.gradoEstudiante)
    this.display = true;
  }

  async generarCertificado() {
    // 1. Notificar al usuario
    this.notifService.showNotification('Generando documento oficial...', 'info');

    // 2. Crear un elemento oculto con el diseño de tu Word
    const data = document.getElementById('certificado-papel');

    if (data) {
      console.log('Va por aqui')
      const canvas = await html2canvas(data);
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      // 3. Descargar
      pdf.save(`Certificado_${this.estudianteSeleccionado?.numeroDocumento}.pdf`);
      this.notifService.showNotification('Certificado descargado con éxito', 'success');
    }
  }

  buscar() {
    if (this.busqueda.length > 2) {
      const data = localStorage.getItem('estudiantes');
      if (data) {
        this.estudiantesFiltradosAux = JSON.parse(data);
        this.estudiantesFiltrados = this.estudiantesFiltradosAux
          .filter(
            (e) =>
              e.nombres.toLowerCase().includes(this.busqueda.toLowerCase()) ||
              e.numeroDocumento.toString().includes(this.busqueda) ||
              e.apellidos.toLowerCase().includes(this.busqueda.toLowerCase()),
          )
          .slice(0, 5);
      } else {
        this.notifService.showNotification(
          'Descarga la lista de estudiante desde el modulo estudiantes',
          'info',
        );
      }
    } else {
      this.estudiantesFiltrados = [];
    }
  }

  seleccionarEstudiante(est: any) {
    this.estudianteSeleccionado = est;
    // this.busquedaEstudiante = est.nombre;
    this.estudiantesFiltrados = [];
  }

  get obtenerTexto() {
    if(this.sexoEstudiante === 'Mas' && parseInt(this.gradoEstudiante) > 5){
      return 'el joven';
    } else if (this.sexoEstudiante === 'Fem' && parseInt(this.gradoEstudiante) > 5) {
      return 'la joven';
    } else if (this.sexoEstudiante === 'Mas' && parseInt(this.gradoEstudiante) < 6){
      return 'el niño';
    } else if (this.sexoEstudiante === 'Fem' && parseInt(this.gradoEstudiante) < 6){
      return 'la niña';
    }
    return 'El niño';
  }
}
