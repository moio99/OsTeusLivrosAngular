import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../core/models/usuario.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/flow/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule/* , FormsModule */ ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nome: ['', Validators.required],
      contrasinal: ['', Validators.required]
    });
  }
  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const user: Usuario = {
      nome: this.loginForm.controls['nome'].value,
      contrasinal: this.loginForm.controls['contrasinal'].value
    };

    this.authService.postLogin(user).subscribe({
      next: () => {
        this.router.navigate(['/estadisticas']); // Redirige al dashboard después del login
      },
      error: (err) => {
        this.error = err.error?.message || 'Error en el login';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
