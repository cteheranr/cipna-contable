import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../../../shared/models/factura.model';
import { FacturaReport } from '../../../../shared/models/factura-detalle.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { Egresos } from '../../../../shared/models/egresos.model';

@Component({
  selector: 'app-diario',
  imports: [CommonModule, FormsModule],
  templateUrl: './diario.html',
  styleUrl: './diario.scss',
})
export class Diario {
  hoyVentas = 0;
  hoyVentasEfectivo = 0;
  hoyVentasTransf = 0;
  hoyVentasDatafono = 0;
  totalRecibos = 0;
  deducionesHoy = 0;
  fechaMaxima: string;

  private firestore: Firestore = inject(Firestore);

  constructor(private cd: ChangeDetectorRef) {
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString().split('T')[0];
  }

  fecha: string = '';
  reportesDiarios: Factura[] = [];
  egresosDiarios: Egresos[] = [];

  reporteGenerado: FacturaReport[] = [];

  descargarReporte(formato: 'pdf' | 'excel') {
    if (formato === 'pdf') this.generarPDF();
    if (formato === 'excel') this.generarExcel();
    // Aquí integrarías una librería como jsPDF o ExcelJS
    alert(`Preparando descarga de reporte en formato ${formato.toUpperCase()}...`);
  }

  async generarReporte() {
    this.hoyVentas = 0;
    this.hoyVentasEfectivo = 0;
    this.hoyVentasTransf = 0;
    this.hoyVentasDatafono = 0;
    this.totalRecibos = 0;
    this.deducionesHoy = 0;
    const fechaDia = this.fecha;

    const q = query(collection(this.firestore, 'recibos'), where('fecha', '==', fechaDia));
    const q2 = query(collection(this.firestore, 'egresos'), where('fecha', '==', fechaDia));

    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);

    const recibos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const egresos = querySnapshot2.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    this.obtenerRecibosTotales(recibos);
    this.obtenerVentasTotales(recibos);
    this.obtenerEgresos(egresos);
  }

  obtenerEgresos(egresos: any[]) {
    this.egresosDiarios = egresos;
    for (const egreso of egresos) {
      this.deducionesHoy += egreso.monto;
    }
    this.cd.detectChanges();
  }

  obtenerRecibosTotales(recibos: any[]) {
    this.totalRecibos = recibos.length;
    this.reportesDiarios = recibos;
    this.cd.detectChanges();
  }

  obtenerVentasTotales(recibos: any[]) {
    for (const recibo of recibos) {
      this.hoyVentas += recibo.monto;

      if (recibo.metodo !== 'mixto') {
        this.sumarMetodo(recibo.metodo, recibo.monto);
      } else {
        const metodos = [
          { metodo: recibo.metodo1, monto: recibo.monto1 },
          { metodo: recibo.metodo2, monto: recibo.monto2 },
          { metodo: recibo.metodo3, monto: recibo.monto3 },
        ];

        for (const m of metodos) {
          if (m.metodo && m.monto) {
            this.sumarMetodo(m.metodo, m.monto);
          }
        }
      }
    }
    this.addInfoReportGen();
    this.cd.detectChanges();
  }

  sumarMetodo(metodo: string, monto: number) {
    if (metodo === 'efectivo') {
      this.hoyVentasEfectivo += monto;
    }

    if (metodo === 'transferencia') {
      this.hoyVentasTransf += monto;
    }

    if (metodo === 'datafono') {
      this.hoyVentasDatafono += monto;
    }
  }

  addInfoReportGen() {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0];
    this.reporteGenerado = [
      {
        FechaGeneracion: fechaFormateada,
        fechaConsultada: this.fecha,
        totalVendido: this.hoyVentas,
      },
    ];
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 15);

    doc.setFontSize(12);
    doc.text(`Fecha: ${this.fecha}`, 14, 25);

    // Totales
    doc.text(`Total recibos: ${this.totalRecibos}`, 14, 40);
    doc.text(`Total efectivo: $${this.hoyVentasEfectivo.toLocaleString()}`, 14, 48);
    doc.text(`Total transferencia: $${this.hoyVentasTransf.toLocaleString()}`, 14, 56);
    doc.text(`Total datáfono: $${this.hoyVentasDatafono.toLocaleString()}`, 14, 64);
    doc.text(`Total egreso: -$${this.deducionesHoy.toLocaleString()}`, 14, 72);
    doc.text(`Total ventas del día: $${this.hoyVentas.toLocaleString()}`, 14, 80);

    const rows = this.reportesDiarios.map((r) => [
      r.estudiante,
      r.notas,
      this.obtenerMontos(r),
      this.obtenerMetodo(r),
      this.obtenerUsuario(r.usuario),
    ]);

    autoTable(doc, {
      startY: 93, // empieza la tabla debajo de los totales
      head: [['Estudiante', 'Concepto', 'Monto', 'Método', 'Usuario']],
      body: rows,
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text('Deducciones / Egresos del Día', 14, finalY);

    finalY += 8;

    const egresosRows = this.egresosDiarios.map((e) => [
      e.concepto,
      `$${e.monto.toLocaleString()}`,
      e.categoria,
    ]);

    autoTable(doc, {
      startY: finalY,
      head: [['Concepto', 'Valor', 'Categoria']],
      body: egresosRows,
    });

    if (!egresosRows.length) {
      finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text('No se realizaron deusiones en el día de hoy', 14, finalY);
    }

    doc.save(`reporte-${this.fecha}.pdf`);
  }

  obtenerMetodo(recibo: any): string {
    if (recibo.metodo !== 'mixto') {
      if (recibo.metodo !== 'efectivo') {
        return recibo.metodo + ' (' + recibo.numeroAprobacion + ')';
      } else {
        return recibo.metodo;
      }
    }

    const metodos: string[] = [];

    if (recibo.metodo1) {
      const metodo1 = recibo.metodo1;
      if (recibo.numeroAprobacion1) {
        const numApro = recibo.numeroAprobacion1;
        metodos.push(metodo1 + ' (' + numApro + ')');
      } else {
        metodos.push(metodo1);
      }
    }
    if (recibo.metodo2) {
      const metodo2 = recibo.metodo2;
      if (recibo.numeroAprobacion2) {
        const numApro = recibo.numeroAprobacion2;
        metodos.push(metodo2 + ' (' + numApro + ')');
      } else {
        metodos.push(metodo2);
      }
    }
    if (recibo.metodo3) {
      const metodo3 = recibo.metodo3;
      if (recibo.numeroAprobacion3) {
        const numApro = recibo.numeroAprobacion3;
        metodos.push(metodo3 + ' (' + numApro + ')');
      } else {
        metodos.push(metodo3);
      }
    }

    return metodos.join(' + ');
  }

  obtenerMontos(recibo: any): string {
    if (recibo.metodo !== 'mixto') {
      return recibo.monto;
    }

    const montos: number[] = [];

    if (recibo.monto1) montos.push(recibo.monto1);
    if (recibo.monto2) montos.push(recibo.monto2);
    if (recibo.monto3) montos.push(recibo.monto3);

    return montos.join(' + ');
  }

  obtenerUsuario(correo: string): string {
    return correo.split('@')[0];
  }

  generarExcel() {
    const resumen = [
      { Concepto: 'Total recibos', Valor: this.totalRecibos },
      { Concepto: 'Total efectivo', Valor: this.hoyVentasEfectivo },
      { Concepto: 'Total transferencia', Valor: this.hoyVentasTransf },
      { Concepto: 'Total datáfono', Valor: this.hoyVentasDatafono },
      { Concepto: 'Total ventas del día', Valor: this.hoyVentas },
    ];
    const data = this.reportesDiarios.map((r) => ({
      Estudiante: r.estudiante,
      Monto: this.obtenerMontos(r),
      Metodo: this.obtenerMetodo(r),
      Usuario: this.obtenerUsuario(r.usuario),
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resumen);
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { Resumen: worksheet, Reporte: worksheet2 },
      SheetNames: ['Resumen', 'Reporte'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });

    saveAs(blob, `reporte-${this.fecha}.xlsx`);
  }
}
