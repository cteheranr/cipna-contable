import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../service/productoSrv/productoSrv';
import { Producto } from '../../shared/models/producto.model';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../service/notificaciones/notificaciones';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  private fb = inject(FormBuilder);
  private productSrv = inject(ProductoService);
  private notifService = inject(NotificationService);

  showModal = false;
  productoForm: FormGroup;
  productos: Producto[] = [];

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
    } else {
      this.getSProducts();
    }
  }

  async getSProducts() {
    const dataProducto = await firstValueFrom(this.productSrv.getProductos());
    this.productos = dataProducto;
    this.subirEnMemoriaPro();
  }

  subirEnMemoriaPro() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
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
}
