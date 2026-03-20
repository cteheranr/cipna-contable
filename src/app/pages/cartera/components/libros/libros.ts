import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { StudentService } from '../../../../service/estudiantes';
import { NotificationService } from '../../../../service/notificaciones/notificaciones';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import {
  Producto,
  PedidosItem,
  Pedido,
  PedidoLibro,
} from '../../../../shared/models/producto.model';
import { EstadoEntrega } from '../../../../shared/models/enums';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Metodos } from '../../../../shared/models/metodos.model';
import { PedidosLibrosService } from '../../../../service/PedidosLibros/PedidosLibros';

@Component({
  selector: 'app-libros',
  imports: [FormsModule, CommonModule],
  templateUrl: './libros.html',
  styleUrl: './libros.scss',
})
export class Libros implements OnInit {
  private studentService = inject(StudentService);
  private PedidosService = inject(PedidosLibrosService);
  private notifService = inject(NotificationService);
  private cd = inject(ChangeDetectorRef);

  busquedaEstudiante = '';
  estudiantesFiltrados: Estudiante[] = [];
  estudiantesFiltradosAux: Estudiante[] = [];
  estudianteSeleccionado!: Estudiante;

  listaProductos: Producto[] = [];
  listaMetodos: String[] = ['Transferencia', 'Datafono'];

  productoActual: Producto | null = null;
  cantidadActual = 0;
  pedido: PedidosItem[] = [];
  totalPedido = 0;
  montoAbono: Metodos[] = [
    {
      metodo: null,
      monto: 0,
      nComprobante: '',
    },
  ];
  entregado: boolean = false;
  nComprobante: string = '';

  ngOnInit() {
    this.getProduts();
  }

  get getMontoAbono() {
    const totalAbonos = this.montoAbono.reduce((acc, abono) => acc + abono.monto, 0);
    return totalAbonos;
  }

  getProduts() {
    this.PedidosService.getLibros().subscribe((data) => {
      this.listaProductos = data;
      this.cd.detectChanges();
    });
  }

  filtrarEstudiantes() {
    if (this.busquedaEstudiante.length > 2) {
      const data = localStorage.getItem('estudiantes');
      if (data) {
        this.estudiantesFiltradosAux = JSON.parse(data);
        this.estudiantesFiltrados = this.estudiantesFiltradosAux
          .filter(
            (e) =>
              e.nombres.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()) ||
              e.numeroDocumento.toString().includes(this.busquedaEstudiante) ||
              e.apellidos.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()),
          )
          .slice(0, 5);
      } else {
        this.studentService.getStudents().subscribe((list) => {
          this.estudiantesFiltrados = list
            .filter(
              (e) =>
                e.nombres.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()) ||
                e.numeroDocumento.toString().includes(this.busquedaEstudiante) ||
                e.apellidos.toLowerCase().includes(this.busquedaEstudiante.toLowerCase()),
            )
            .slice(0, 5);
        });
      }
    } else {
      this.estudiantesFiltrados = [];
    }
  }

  seleccionarEstudiante(est: any) {
    this.estudianteSeleccionado = est;
    this.busquedaEstudiante = est.nombre;
    this.estudiantesFiltrados = [];
  }

  agregarAlPedido() {
    if (this.productoActual) {
      const item = {
        ...this.productoActual,
        cantidad: this.cantidadActual,
        total: this.productoActual.precio * this.cantidadActual,
        estadoEntrega: EstadoEntrega.PENDIENTE,
      };
      this.pedido.push(item);
      this.totalPedido += item.total;
      this.productoActual = null;
      this.cantidadActual = 1;
    }
  }

  registrarVenta() {
    const dataVenta = {
      estudiante: this.estudianteSeleccionado.nombres + ' ' + this.estudianteSeleccionado.apellidos,
      categoria: 'Libros',
      items: this.pedido,
      total: this.totalPedido,
      abonoTotal: this.getMontoAbono,
      fecha: new Date().toISOString().substring(0, 10),
      metodoDePago: this.montoAbono,
    };

    this.PedidosService.addPedidoLibro(dataVenta)
      .then((res) => {
        this.notifService.showNotification('¡Venta de uniforme registrada con éxito!', 'success');
        this.imprimirRecibo(dataVenta);
      })
      .catch((error) => {
        this.notifService.showNotification('Error al registrar el pedido', 'error');
      });
  }

  eliminarProducto(item: number) {
    const descontar = this.pedido[item].precio;
    this.totalPedido -= descontar;
    this.pedido.splice(item, 1);
  }

  imprimirRecibo(recibo: PedidoLibro) {
    const ventana = window.open('', '_blank', 'width=800,height=600');
    const usuario = localStorage.getItem('currentUser');

    const detalleItems = recibo.items
      .map(
        (item) => `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toLocaleString()}</td>
        <td>$${(item.cantidad * item.precio).toLocaleString()}</td>
      </tr>
    `,
      )
      .join('');

    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Recibo ${recibo.estudiante}</title>
          <style>
            body { font-family: Arial; padding: 30px; }
            h2, h3, p { text-align: center; }
            .line { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h3>INSTITUTO EDUCATIVO</h3>
          <h2>NUEVA AMERICA</h2>
          <p>NIT: 800008061-8</p>
          <p>Nuevo Bosque Mz 52 Lt 02 etapa 7</p>
          <p>Cartagena, Bolívar.</p>
          <p>Tel. 605 6654780</p>
  
          <h2>RECIBO DE LIBROS</h2>
          <div class="line"><strong>Estudiante:</strong> ${recibo.estudiante}</div>
  
          <h3>Detalle del Pedido</h3>
  
          <table border="1" width="100%" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${detalleItems}
            </tbody>
          </table>
        
          <br/>
          <div class="line"><strong>Valor Total:</strong> $${recibo.total.toLocaleString()}</div>
          <div class="line"><strong>Abono:</strong> $${recibo.abonoTotal.toLocaleString()}</div>
          <div class="line"><strong>Fecha:</strong> ${recibo.fecha}</div>
          <div class="line"><strong>Responsable:</strong> ${usuario?.split('@')[0]}</div>
  
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          <\/script>
        </body>
      </html>
    `);

    ventana.document.close();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  aggMetodoPago() {
    const newMetodo = {
      metodo: null,
      monto: 0,
      nComprobante: '',
    };
    this.montoAbono.push(newMetodo);
  }

  deleteMetodoPago() {
    this.montoAbono.pop();
  }

  get confirmarPago() {
    return this.totalPedido - this.getMontoAbono === 0;
  }

  get confirmarMetodos(): boolean {
    return this.montoAbono.every((m) => m.nComprobante && m.nComprobante.trim() !== '');
  }
}
