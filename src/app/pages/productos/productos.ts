import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductoService } from '../../service/productoSrv/productoSrv';
import { Producto } from '../../shared/models/producto.model';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../service/notificaciones/notificaciones';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  private fb = inject(FormBuilder);
  private productSrv = inject(ProductoService);
  private notifService = inject(NotificationService);

  showModal = false;
  busquedaProducto = '';
  productoForm: FormGroup;
  productos: Producto[] = [];
  productosAll: Producto[] = [];
  categorias = [
    {
      label: 'Todos',
      active: true,
    },
    {
      label: 'Libro',
      active: false,
    },
    {
      label: 'Uniforme',
      active: false,
    },
    {
      label: 'Pre-Icfes',
      active: false,
    },
  ];

  constructor(private cd: ChangeDetectorRef) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['Uniforme', Validators.required],
      precio: [0, [Validators.required, Validators.min(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }
  async ngOnInit() {
    this.getSProductsLocal();
  }

  getSProductsLocal() {
    const data = localStorage.getItem('productos');

    if (data) {
      this.productos = JSON.parse(data);
      this.productosAll = JSON.parse(data);
    } else {
      this.getSProducts();
    }
  }

  async getSProducts() {
    const dataProducto = await firstValueFrom(this.productSrv.getProductos());
    console.log("DATA", dataProducto);
    this.productos = dataProducto;
    this.productosAll = dataProducto;
    this.subirEnMemoriaPro();
    this.cd.detectChanges();
  }

  subirEnMemoriaPro() {
    localStorage.setItem('productos', JSON.stringify(this.productosAll));
    this.getSProductsLocal();
    this.cd.detectChanges();
  }

  abrirModalNuevo() {
    this.showModal = true;
  }

  cerrarModal() {
    localStorage.removeItem('productos');
    this.showModal = false;
    this.productoForm.reset({ categoria: 'Uniforme', precio: 0, stock: 0 });
  }

  actualizarProductos() {
    this.getSProducts();
  }

  activarCategoria(index: number) {
    this.categorias.forEach((categoria) => {
      categoria.active = false;
    });
    this.categorias[index].active = true;

    if (this.categorias[index].label === 'Todos') {
      this.productos = this.productosAll;
    } else {
      this.productos = this.productosAll.filter(
        (p) => p.categoria === this.categorias[index].label,
      );
    }
  }

  async guardarProducto() {
    if (this.productoForm.valid) {
      const nuevoProducto = {
        ...this.productoForm.value,
        activo: true,
      };
      try {
        const ref = await this.productSrv.addProductos(nuevoProducto);
        this.cerrarModal();
        this.getSProducts();
        this.notifService.showNotification('Producto registrado con exito.', 'success');
      } catch (error) {
        console.error('Error guardando producto:', error);
        this.notifService.showNotification('Error guardando el producto', 'error');
      }
    }
  }

  filtrarProductos() {
    if (this.busquedaProducto.length > 2) {
      const data = localStorage.getItem('estudiantes');
      this.productos = this.productosAll;
      this.categorias.map((cat) => {
        cat.active = false;
      });
      if (data) {
        this.productos = this.productosAll
          .filter((e) => e.nombre.toLowerCase().includes(this.busquedaProducto.toLowerCase()))
          .slice(0, 5);
      }
    } else {
      this.productos = this.productosAll;
      const index = this.categorias.findIndex((cat) => cat.label === 'Todos'
      );
      this.categorias[index].active = true;
    }
  }
}
