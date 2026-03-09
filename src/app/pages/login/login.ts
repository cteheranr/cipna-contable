import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ɵInternalFormsSharedModule,
  FormGroupName,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../service/authSrv/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  password_visible: boolean = false;
  message: string = '';
  loginForm!: FormGroup;

  constructor(
    private loginService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.message = '';

    if (this.loginForm.valid) {
      console.log('Datos del Formulario:', this.loginForm.value);
      const email = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.loginService
        .login(email, password)
        .then((res) => {
          this.router.navigate(['../app/home'], {
            relativeTo: this.activatedRoute,
          });
        })
        .catch((error) => {
          console.error('este es el error', error);
          this.message = 'El usuario o la contraseña son incorrectos';
          this.cd.detectChanges();
        });
    }
  }
}
