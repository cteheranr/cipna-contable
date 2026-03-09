import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Estudiante } from '../../../../shared/models/estudiantes.model';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-facturas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './facturas.html',
  styleUrl: './facturas.scss',
})
export class Facturas implements OnInit {
  lista: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  mostrarSugerencias = false;

  private fb = inject(FormBuilder);
  private firestore: Firestore = inject(Firestore);

  ventaForm: FormGroup;
  estudianteEncontrado: Estudiante | null = null;
  addMetodo: boolean = false;

  constructor() {
    this.ventaForm = this.fb.group({
      estudianteDoc: ['', Validators.required],
      estudiante: [''],
      concepto: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(1)]],
      metodo: ['efectivo', Validators.required],
      notas: [''],
      numeroAprobacion: [''],
      metodo1: [''],
      monto1: [0],
      numeroAprobacion1: [''],
      metodo2: [''],
      monto2: [0],
      numeroAprobacion2: [''],
      metodo3: [''],
      monto3: [0],
      numeroAprobacion3: [''],
    });

    this.ventaForm.get('metodo1')?.valueChanges.subscribe((metodo) => {
      this.ventaForm.get('monto1')?.setValue(0);
    });

    this.ventaForm.get('metodo2')?.valueChanges.subscribe((metodo) => {
      this.ventaForm.get('monto2')?.setValue(0);
    });

    this.ventaForm.get('metodo3')?.valueChanges.subscribe((metodo) => {
      this.ventaForm.get('monto3')?.setValue(0);
    });
  }
  ngOnInit(): void {
    this.getStudents();
    this.ventaForm.get('estudianteDoc')?.valueChanges.subscribe((valor) => {
      if (!valor) {
        this.estudiantesFiltrados = [];
        this.mostrarSugerencias = false;
        return;
      }

      this.estudiantesFiltrados = this.lista.filter((est) =>
        est.nombres.toLowerCase().includes(valor.toLowerCase()),
      );

      this.mostrarSugerencias = this.estudiantesFiltrados.length > 0;
    });
  }

  getStudents() {
    const data = localStorage.getItem('estudiantes');

    if (data) {
      this.lista = JSON.parse(data);
    }
  }

  seleccionarEstudiante(est: Estudiante) {
    this.ventaForm.patchValue({
      estudianteDoc: est.numeroDocumento,
      estudiante: est.nombres + ' ' + est.apellidos,
    });

    this.estudianteEncontrado = est;
    this.mostrarSugerencias = false;
  }

  async generarFactura() {
    if (this.estudianteEncontrado) {
      const hoy = new Date();
      const fechaFormateada = hoy.toISOString().split('T')[0];
      const data = {
        ...this.ventaForm.value,
        fecha: fechaFormateada,
        usuario: localStorage.getItem('currentUser'),
        estado: 'pagado',
      };

      if (this.ventaForm.value.metodo === 'mixto') {
        console.log('Aqui entro');
        if (this.verificacionDeMontos()) {
          await this.enviarDatos(data);
        }
      } else {
        console.log('Entro');
        this.enviarDatos(data);
      }
    }
  }

  async enviarDatos(data: any) {
    try {
      const ref = await addDoc(collection(this.firestore, 'recibos'), data);
      console.log('Guardado con ID:', ref.id);
      this.imprimirRecibo({ id: ref.id, ...data });
    } catch (error) {
      console.error('Error guardando recibo:', error);
    }
  }

  verificacionDeMontos(): boolean {
    const monto1 = parseInt(this.ventaForm.value.monto1);
    console.log('Monto1- ', monto1);
    const monto2 = parseInt(this.ventaForm.value.monto2);
    console.log('Monto2- ', monto2);
    const monto3 = parseInt(this.ventaForm.value.monto3);
    console.log('Monto3- ', monto3);

    const total = monto1 + monto2 + monto3;
    console.log(this.ventaForm.value.monto, 'Este es el valor que debe sumar: ', total);

    if (this.ventaForm.value.monto === total) {
      return true;
    } else {
      confirm('Los montos no coiciden con el valor total de la factura');
      return false;
    }
  }

  imprimirRecibo(recibo: any) {
    const ventana = window.open('', '_blank', 'width=800,height=600');
    const usuario = localStorage.getItem('currentUser');

    if (!ventana) return;

    if (recibo.metodo === 'mixto' && usuario) {
      ventana.document.write(`
        <html>
          <head>
            <title>Recibo ${recibo.id}</title>
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

            <h2>RECIBO DE PAGO</h2>
            <div class="line"><strong>ID:</strong> ${recibo.id}</div>
            <div class="line"><strong>Estudiante:</strong> ${recibo.estudianteDoc}</div>
            <div class="line"><strong>Concepto:</strong> ${recibo.concepto}</div>
            <div class="line"><strong>Monto Total:</strong> $${recibo.monto}</div>

            <div class="line"><strong>Método #1:</strong> ${recibo.metodo1}</div>
            <div class="line"><strong>Monto Total:</strong> $${recibo.monto1}</div>
            <div class="line"><strong>Monto Numero de aprobación metodo 1:</strong> $${recibo.numeroAprobacion1}</div>

            <div class="line"><strong>Método #2:</strong> ${recibo.metodo2}</div>
            <div class="line"><strong>Monto Total:</strong> $${recibo.monto2}</div>
            <div class="line"><strong>Monto Numero de aprobación metodo 2:</strong> $${recibo.numeroAprobacion2}</div>

            <div class="line"><strong>Método #3:</strong> ${recibo.metodo3}</div>
            <div class="line"><strong>Monto Total:</strong> $${recibo.monto3}</div>
            <div class="line"><strong>Monto Numero de aprobación metodo 3:</strong> $${recibo.numeroAprobacion3}</div>


            <div class="line"><strong>Fecha:</strong> ${new Date().toLocaleString()}</div>
            <div class="line"><strong>Responsable:</strong> ${usuario.split('@')[0]}</div>

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
    } else {
      ventana.document.write(`
    <html>
      <head>
        <title>Recibo ${recibo.id}</title>
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

        <h2>RECIBO DE PAGO</h2>
        <div class="line"><strong>ID:</strong> ${recibo.id}</div>
        <div class="line"><strong>Estudiante:</strong> ${recibo.estudianteDoc}</div>
        <div class="line"><strong>Concepto:</strong> ${recibo.concepto}</div>
        <div class="line"><strong>Monto:</strong> $${recibo.monto}</div>
        <div class="line"><strong>Método:</strong> ${recibo.metodo}</div>
        <div class="line"><strong>Monto Numero de aprobación:</strong> $${recibo.numeroAprobacion}</div>
        <div class="line"><strong>Fecha:</strong> ${new Date().toLocaleString()}</div>
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
    }

    ventana.document.close();
    this.limpiarForm();
    this.addMetodo = false;
  }

  limpiarForm() {
    this.ventaForm.reset({
      metodo: 'efectivo',
      monto: 0,
      notas: '',
      numeroAprobacion: '',
      metodo1: 'efectivo',
      monto1: 0,
      numeroAprobacion1: '',
      metodo2: 'efectivo',
      monto2: 0,
      numeroAprobacion2: '',
      metodo3: '',
      monto3: 0,
      numeroAprobacion3: '',
    });

    this.estudianteEncontrado = null;
  }

  agregarMed() {
    this.addMetodo = true;
  }

  eliminarMed() {
    this.addMetodo = false;
  }
}
