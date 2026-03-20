import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { Productos } from './productos';
import { ProductoService } from '../../service/productoSrv/productoSrv';
import { NotificationService } from '../../service/notificaciones/notificaciones';

describe('Productos', () => {
  let component: Productos;
  let fixture: ComponentFixture<Productos>;
  let productoSrvMock: any;
  let notifSrvMock: any;

  beforeEach(async () => {
    productoSrvMock = {
      getProductos: jasmine.createSpy('getProductos').and.returnValue(of([])),
      addProductos: jasmine.createSpy('addProductos').and.returnValue(Promise.resolve({})),
    };

    notifSrvMock = {
      showNotification: jasmine.createSpy('showNotification'),
    };

    await TestBed.configureTestingModule({
      imports: [Productos, ReactiveFormsModule],
      providers: [
        { provide: ProductoService, useValue: productoSrvMock },
        { provide: NotificationService, useValue: notifSrvMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Productos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products from localStorage when available in getSProductsLocal', () => {
    const sample = [{ nombre: 'P', categoria: 'Libro' }];
    localStorage.setItem('productos', JSON.stringify(sample));

    component.productos = [];
    component.getSProductsLocal();

    expect(component.productos.length).toBe(1);
    expect(component.productosAll.length).toBe(1);

    localStorage.removeItem('productos');
  });

  it('should call service to get products when localStorage is empty', async () => {
    localStorage.removeItem('productos');
    productoSrvMock.getProductos.and.returnValue(of([{ nombre: 'X' }]));

    await component.getSProducts();

    expect(productoSrvMock.getProductos).toHaveBeenCalled();
    expect(component.productos.length).toBe(1);
  });

  it('should filter products by category when activarCategoria is called', () => {
    component.productosAll = [
      { nombre: 'A', categoria: 'Libro' },
      { nombre: 'B', categoria: 'Uniforme' },
    ];

    component.activarCategoria(1); // index 1 is 'Libro' in categorias array

    expect(component.categorias[1].active).toBeTrue();
    expect(component.productos.every(p => p.categoria === 'Libro')).toBeTrue();
  });

  it('should open and close modal and reset form on cerrarModal', () => {
    component.abrirModalNuevo();
    expect(component.showModal).toBeTrue();

    localStorage.setItem('productos', JSON.stringify([]));
    component.cerrarModal();

    expect(component.showModal).toBeFalse();
    expect(component.productoForm.value.categoria).toBe('Uniforme');
  });

  it('should call addProductos and show success notification when guardarProducto is valid', async () => {
    component.productoForm.setValue({ nombre: 'Nuevo', categoria: 'Uniforme', precio: 200, stock: 1 });
    productoSrvMock.addProductos.and.returnValue(Promise.resolve({}));

    await component.guardarProducto();

    expect(productoSrvMock.addProductos).toHaveBeenCalled();
    expect(notifSrvMock.showNotification).toHaveBeenCalledWith('Producto registrado con exito.', 'success');
  });

  it('should show error notification when addProductos throws', async () => {
    component.productoForm.setValue({ nombre: 'Err', categoria: 'Uniforme', precio: 200, stock: 1 });
    productoSrvMock.addProductos.and.returnValue(Promise.reject('fail'));

    await component.guardarProducto();

    expect(notifSrvMock.showNotification).toHaveBeenCalledWith('Error guardando el producto', 'error');
  });
});
