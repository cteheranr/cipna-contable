import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { Pedido, PedidoLibro } from '../../../../shared/models/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosLibrosService } from '../../../../service/PedidosLibros/PedidosLibros';

@Component({
  selector: 'app-report-libro',
  imports: [CommonModule, FormsModule],
  templateUrl: './report-libro.html',
  styleUrl: './report-libro.scss',
})
export class ReportLibro {
  private PedidosService = inject(PedidosLibrosService);
  private cd = inject(ChangeDetectorRef);
  pedidoSeleccionado: any;
  panelDetalleAbierto: boolean = false;

  fechaMaxima: string = new Date().toISOString().split('T')[0];
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroNombre: string = '';
  estudiantesFiltrados: Estudiante[] = [];
  estudiantesFiltradosAux: Estudiante[] = [];

  totalPedidos = 0;
  totalRecaudado = 0;

  AllPedidos: PedidoLibro[] = [];

  pedidosFiltrados: PedidoLibro[] = [];

  ngOnInit() {
    this.getAllPedidos();
  }

  getAllPedidos() {
    this.PedidosService.getPedidosLibros().subscribe((data) => {
      this.AllPedidos = data;
      this.pedidosFiltrados = data;
      this.totalPedidos = data.length;
      this.AllPedidos.forEach((pedido) => {
        this.totalRecaudado += pedido.total;
      });
      this.cd.detectChanges();
    });
  }

  filtrarEstudiantes() {
    const texto = this.filtroNombre.toLowerCase();

    this.pedidosFiltrados = this.AllPedidos.filter((p) =>
      p.estudiante.toLowerCase().includes(texto),
    );
  }

  consultar() {
    if (this.fechaInicio && this.fechaFin) {
      const inicio = new Date(this.fechaInicio);
      const fin = new Date(this.fechaFin);

      this.pedidosFiltrados = this.AllPedidos.filter((pedido) => {
        const fechaPedido = new Date(pedido.fecha);

        return fechaPedido >= inicio && fechaPedido <= fin;
      });
    } else {
      this.pedidosFiltrados = this.AllPedidos;
    }
  }
}
