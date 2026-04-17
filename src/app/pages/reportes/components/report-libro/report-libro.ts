import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { Pedido, PedidoLibro } from '../../../../shared/models/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosLibrosService } from '../../../../service/PedidosLibros/PedidosLibros';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  hoyVentasTransf: number = 0;
  hoyVentasDatafono: number = 0;
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

      this.totalPedidos = this.pedidosFiltrados.length;
      this.totalRecaudado = this.pedidosFiltrados.reduce((total, pedido) => {
        return total + (pedido.total || 0);
      }, 0);

      console.log("Total", this.totalPedidos)
    } else {
      this.pedidosFiltrados = this.AllPedidos;
    }
  }

  sumarMetodo(metodo: string, monto: number) {
    if (metodo === 'transferencia') {
      this.hoyVentasTransf += monto;
    }

    if (metodo === 'datafono') {
      this.hoyVentasDatafono += monto;
    }
  }

  imprimirReporte() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Ventas de Libros', 14, 15);

    doc.setFontSize(12);
    if (this.fechaInicio) {
      doc.text(`Fecha: ${this.fechaInicio} - ${this.fechaFin}`, 14, 25);
    } else {
      doc.text(`Fecha: 2026-03-20 a ${new Date().toISOString().split('T')[0]}`, 14, 25);
    }

    // Totales
    doc.text(`Total ventas: ${this.totalPedidos}`, 14, 40);
    doc.text(`Total transferencia: $${this.totalRecaudado.toLocaleString()}`, 14, 48);
    doc.text(`Total datáfono: $${this.hoyVentasTransf.toLocaleString()}`, 14, 56);
    doc.text(`Total datáfono: $${this.hoyVentasDatafono.toLocaleString()}`, 14, 64);
    doc.text(`Total ventas del día: $${this.totalRecaudado.toLocaleString()}`, 14, 72);

    const rows = this.pedidosFiltrados.map((r) => [
      r.estudiante,
      this.obtenerItem(r),
      r.total,
      this.obtenerMetodo(r),
    ]);

    autoTable(doc, {
      startY: 85, // empieza la tabla debajo de los totales
      head: [['Estudiante', 'Concepto', 'Monto', 'Método']],
      body: rows,
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(14);

    doc.save(`reporte-libros-${this.fechaInicio}.pdf`);
  }

  obtenerItem(pedido: any) {
    let pedidoT = '';
    if (pedido.items.length > 1) {
      for (let i = 0; i < pedido.items.length; i++) {
        pedidoT += pedido.items[i].nombre;
      }
      return pedidoT;
    }
    return pedido.items[0].nombre;
  }

  obtenerMetodo(pedido: any) {
    let metodos = '';
    if (pedido.metodoDePago.length > 1) {
      for (let i = 0; i < pedido.metodoDePago.length; i++) {
        metodos += pedido.metodoDePago[i].metodo + ' (' + pedido.metodoDePago[i].nComprobante + ')';
      }
      return metodos;
    }
    return pedido.metodoDePago[0].metodo + ' (' + pedido.metodoDePago[0].nComprobante + ')';
  }
}
