import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutService } from '@servizosFlow';
import { catchError, concatMap, EMPTY, first, map, of, startWith, tap } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DadosOutrosService } from '../../core/services/flow/dados-outros.service';
import { OutrosService } from '@servizosApi';
import { InformacomPeTipo } from '../../shared/enums/estadisticasTipos';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Idioma } from '../../shared/models/outros.model';
import { AltaUsuario, dadosComplementarios } from '@interfaces';
import { ValidaconsAMedida } from '../../shared/validators/custom-validators';
import { UsuariosService } from '../../core/services/api/usuarios.service';
import { PeComponent } from '@componhentesComuns';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-alta',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    PeComponent,
    TranslocoPipe,
  ],
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.scss']
})
export class AltaUsuarioComponent {
  readonly loading = signal<boolean>(false);
  private readonly fb = inject(NonNullableFormBuilder); // Evita que os campos sexan null ao facer reset
  private readonly dadosOutrosService = inject(DadosOutrosService);
  private readonly outrosService = inject(OutrosService);
  private readonly layoutService = inject(LayoutService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly translocoService = inject(TranslocoService);

  readonly altaForm = this.fb.group({
    nome: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    pass: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    pergunta: new FormControl('', [Validators.required, Validators.maxLength(45)]),
    contestacom: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    correio: new FormControl('', [Validators.required,
      Validators.maxLength(80),
      // Validators.email
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    idIdioma: new FormControl<string | number>('', [
      Validators.required,
      ValidaconsAMedida.idiomaSeleccionado
    ])
  });
  get af() { return this.altaForm.controls; }

  idiomasResource = rxResource({
    stream: () => {
      // Se xa están en caché, devolvemos un observable inmediato para non ir ao servidor
      const cache = this.dadosOutrosService.getDadosOutrosCache();
      if (cache?.idiomas) return of(cache.idiomas.data);

      return this.outrosService.getIdiomas().pipe(
        first(),
        map(r => {
          if (r) {
            const resposta = r as dadosComplementarios<Idioma>
            return resposta.data;
          }
          return [];
        }),
        catchError((e) => this.manejarErroSoporte(e))
      );
    }
  });

  textoBibliotecaFiltro = toSignal(
    this.altaForm.controls.idIdioma.valueChanges.pipe(
      startWith(this.altaForm.controls.idIdioma.value ?? '')
    ),
    { initialValue: '' as string | number }
  );

  idiomasFiltrados = computed(() => {
    const textoBusca = this.amosarIdioma(this.textoBibliotecaFiltro()).trim().toLowerCase();
    const listaCompleta = this.idiomasResource.value() ?? [];

    if (!textoBusca) {
      return listaCompleta;
    }

    return listaCompleta.filter(idioma =>
      idioma.nome.toLowerCase().includes(textoBusca)
    );
  });

  amosarIdioma = (id: string | number | null): string => {
    if (typeof id !== 'number') {
      return id ?? '';
    }

    return this.idiomasResource.value()?.find(idioma => idioma.id === id)?.nome ?? '';
  };

  onSubmit(): void {
    if (this.altaForm.invalid) return;
    this.loading.set(true);

    const novoUsuario = this.createElementoForm();
    this.usuariosService.getUsuarioPorNome(novoUsuario.nome).pipe(
      first(),  // Collo o primeiro valor da consulta do nome e pechamos esa canle
      concatMap((usuario) => {  // concatMap asegura que a seguinte chamada agarde a que esta remate sem cancelarse
        if (usuario && usuario.meta.quantidade > 0) {
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Aviso,
            mensagem: this.translocoService.translate('signup.usernameExists')
          });
          this.loading.set(false);
          return EMPTY; // Corta o fluxo de forma segura se está repetido
        }

        return this.usuariosService.postUsuario(novoUsuario).pipe(first());
      })
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Sucesso,
          mensagem: this.translocoService.translate('signup.userAdded', { name: novoUsuario.nome })
        });
        this.altaForm.reset();
      },
      error: (e: unknown) => {
        console.error(e);
        this.loading.set(false);
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Erro,
          mensagem: this.translocoService.translate('signup.addError')
        });
      }
    });
  }

  private createElementoForm(): AltaUsuario {
    const usuario: AltaUsuario = {
      id: 0,
      nome: String(this.af.nome.value),
      pass: String(this.af.pass.value),
      pergunta: String(this.af.pergunta.value),
      contestacom: String(this.af.contestacom.value),
      correio: String(this.af.correio.value),
      idIdioma: Number(this.af.idIdioma.value),
      ativado: true
    };
    return usuario;
  }

  private manejarErroSoporte(e: any) {
    console.error(e);
    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Erro,
      mensagem: this.translocoService.translate('signup.languageLoadError')
    });
    return of([]);
  }
}
