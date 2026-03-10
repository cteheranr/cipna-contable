import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgresosService } from '../../service/EgresosSrv/egresosSrv';
import { NotificationService } from '../../service/notificaciones/notificaciones';

@Component({
  selector: 'app-egresos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './egresos.html',
  styleUrl: './egresos.scss',
})
export class Egresos {
  egresoForm!: FormGroup;
  fechaMaxima: string;
  categorias = ['Suministros', 'Servicios', 'Nómina', 'Mantenimiento', 'Anticipos', 'Otros'];

  private fb = inject(FormBuilder);
  private egresosSrv = inject(EgresosService);
  private notifService = inject(NotificationService);

  constructor(){
    const hoy = new Date();
    this.fechaMaxima = hoy.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.egresoForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      concepto: ['', [Validators.required, Validators.minLength(3)]],
      monto: [null, [Validators.required, Validators.min(1)]],
      categoria: ['', Validators.required],
    });
  }

  async registrarEgreso() {
    if (this.egresoForm.valid) {
      const nuevoEgreso = this.egresoForm.value;
      console.log('Registrando egreso:', nuevoEgreso);
      try {
        const ref = await this.egresosSrv.addEgresos(nuevoEgreso);

        this.notifService.showNotification('¡Egreso registrado con éxito!', 'success');
        this.egresoForm.reset({
          fecha: new Date().toISOString().substring(0, 10),
          categoria: '',
        });

      } catch (error) {
        this.notifService.showNotification('Error guardando del egreso'+error, 'error');
        console.error('Error guardando del egreso:', error);
      }
    }
  }
}
