import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from "./shared/components/snackbar/snackbar";
import { Detalles } from './pages/reportes/components/uniformes/detalles/detalles';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cipna-contable');
  
}
