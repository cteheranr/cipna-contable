import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../service/productoSrv/productoSrv';
import { Producto } from '../../shared/models/producto.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss',
})
export class Productos implements OnInit {
  private fb = inject(FormBuilder);
  private productSrv = inject(ProductoService);
  showModal = false;
  productoForm: FormGroup;
  productos: Producto[] = [];

  constructor() {
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
  }

  subirEnMemoriaEst() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
    this.getSProductsLocal();
  }

  abrirModalNuevo() {
    this.showModal = true;
  }

  cerrarModal() {
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
        console.log('Guardado con ID:', ref.id);
        this.cerrarModal();
        this.getProductosPosReg();
      } catch (error) {
        console.error('Error guardando producto:', error);
      }
    }
  }

  async getProductosPosReg() {
    window.location.reload();
  }
}
