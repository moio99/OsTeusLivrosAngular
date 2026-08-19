import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '@interfaces';
import { AuthService } from '@servizosFlow';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder); // Evita que os campos sexan null ao facer reset
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string>('');

  // Formulario fortemente tipado de xeito automático
  protected readonly loginForm = this.fb.group({
    nome: ['', Validators.required],
    contrasinal: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    // Grazas ao NonNullableFormBuilder, os controis son seguros e teñen tipo estrito
    const user: Usuario = {
      nome: this.loginForm.controls.nome.value,
      contrasinal: this.loginForm.controls.contrasinal.value
    };

    this.authService.postLogin(user)
      .pipe(first()) // Boa práctica: pecha o fluxo automaticamente tras recibir a resposta
      .subscribe({
        next: () => {
          this.router.navigate(['/estadisticas']);
        },
        error: (err: any) => {
          this.error.set(err.error?.mensagem || 'Erro no inicio de sesion');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
  }
}

