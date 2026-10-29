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
            this.setIdioma(usuario.usuario?.idioma ?? 1);
            this.router.navigate(['/estadisticas']);
          }
          else {
            this.error.set(this.translocoService.translate('login.error'));
          }
        },
        error: (err: any) => {
          this.error.set(err.error?.mensagem || this.translocoService.translate('login.error'));
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

  private setIdioma(idioma: number) {
    switch (idioma) {
      case 1:
      case 2:
        this.translocoService.setActiveLang('gl');
        break;
      case 3:
        this.translocoService.setActiveLang('pt');
        break;
      case 4:
        this.translocoService.setActiveLang('ast');
        break;
      case 5:
        this.translocoService.setActiveLang('eu');
        break;
      case 6:
        this.translocoService.setActiveLang('ca');
        break;
      case 7:
        this.translocoService.setActiveLang('an');
        break;
      case 8:
        this.translocoService.setActiveLang('es');
        break;
      case 9:
        this.translocoService.setActiveLang('fr');
        break;
      case 15:
        this.translocoService.setActiveLang('it');
        break;
      case 113: // Bretom
        this.translocoService.setActiveLang('br');
        break;
      case 154: // Eire
        this.translocoService.setActiveLang('ga');
        break;
      case 138: // Corso
        this.translocoService.setActiveLang('co');
        break;
      case 190: // Sardo
        this.translocoService.setActiveLang('sc');
        break;
      case 191: // Gaelico de Alba
        this.translocoService.setActiveLang('gd');
        break;
      case 214: // Galés
        this.translocoService.setActiveLang('cy');
        break;
      case 215: // galó da bretanha francesa
        this.translocoService.setActiveLang('roa-gal');
        break;
      case 216: // Escoces
        this.translocoService.setActiveLang('sco');
        break;
      default:
        this.translocoService.setActiveLang('gl');
        break;
    }
  }
}
