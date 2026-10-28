import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DadosLogueo, Usuario } from '@interfaces';
import { AuthService } from '@servizosFlow';
import { first } from 'rxjs';
import { UsuariosService } from '../../core/services/api/usuarios.service';
import { TranslocoDirective , TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder); // Evita que os campos sexan null ao facer reset
  private readonly authService = inject(AuthService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string>('');
  private readonly translocoService = inject(TranslocoService);

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

    this.usuariosService.postLogin(user)
      .pipe(first()) // Boa práctica: pecha o fluxo automaticamente tras recibir a resposta
      .subscribe({
        next: (usuario: DadosLogueo) => {
          if (usuario.token) {
            this.authService.setUserData(usuario);
            this.router.navigate(['/estadisticas']);
          }
          else {
            this.error.set('Erro no inicio da sessom');
          }
        },
        error: (err: any) => {
          this.error.set(err.error?.mensagem || 'Erro no inicio da sessom');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
  }

  troco(idioma: string) {
    this.translocoService.setActiveLang(idioma);
  }
}

