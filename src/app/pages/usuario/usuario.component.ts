import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LayoutService } from '@servizosFlow';
import { catchError, EMPTY, first, map, of, startWith, switchMap, tap } from 'rxjs';
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
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent {

  readonly loading = signal<boolean>(false);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder); // Evita que os campos sexan null ao facer reset
  private readonly dadosOutrosService = inject(DadosOutrosService);
  private readonly outrosService = inject(OutrosService);
  private readonly layoutService = inject(LayoutService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly translocoService = inject(TranslocoService);

  idUsuario = this.authService.getUsuarioLogado()?.id ?? 0;

  readonly usuarioForm = this.fb.group({
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
  get af() { return this.usuarioForm.controls; }

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

  usuarioResource = rxResource({
    params: () => this.idUsuario,
    stream: ({ params: id }) => {
      const currentId = id;

      // Se o ID é 0 (modo engadir), non facemos petición HTTP e devolvemos null
      if (!currentId || currentId === 0) return of(null);

      return this.usuariosService.getUsuarioPorId(currentId).pipe(
        first(),
        map( dados => {
        if (dados.data && dados.data.length > 0) {
          return dados.data[0];
        }
        return undefined;
      }),
        catchError((e) => {
          this.manejarErroSoporte(e);
          return of(null); })
      );
    }
  });

  textoIdiomaFiltro = toSignal(
    this.usuarioForm.controls.idIdioma.valueChanges.pipe(
      startWith(this.usuarioForm.controls.idIdioma.value ?? '')
    ),
    { initialValue: '' as string | number }
  );

  idiomasFiltrados = computed(() => {
    const textoBusca = this.amosarIdioma(this.textoIdiomaFiltro()).trim().toLowerCase();
    const listaCompleta = this.idiomasResource.value() ?? [];

    if (!textoBusca) {
      return listaCompleta;
    }

    return listaCompleta.filter(idioma =>
      idioma.nome.toLowerCase().includes(textoBusca)
    );
  });

  constructor() {
    effect(() => {
      const usuario = this.usuarioResource.value(); // Acceso reactivo ao valor do resource

      if (usuario) {
        this.usuarioForm.patchValue({
          nome: usuario.nome,
          pass: usuario.pass,
          correio: usuario.correio,
          pergunta: usuario.pergunta,
          contestacom: usuario.contestacom,
          idIdioma: usuario.idIdioma
        });
      } else {
        this.usuarioForm.reset();
      }
    });
  }

  amosarIdioma = (id: string | number | null): string => {
    if (typeof id !== 'number') {
      return id ?? '';
    }

    return this.idiomasResource.value()?.find(idioma => idioma.id === id)?.nome ?? '';
  };

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    let nomeValue = this.usuarioForm.controls.nome.value;
    if (nomeValue) {
      nomeValue = nomeValue.trim();
      const elemento = this.createElementoForm();

      // Encadeamos de xeito reactivo as dúas peticións do servidor
      this.usuariosService.getUsuarioPorNome(nomeValue).pipe(
        first(),
        // O operador switchMap intercepta o resultado de duplicados e decide o seguinte fluxo
        switchMap((elementoExistente: any) => {
          const meta = elementoExistente?.meta;
          const isDuplicate = meta && meta.quantidade > 0 &&
            (this.idUsuario === 0 || +meta.id !== this.idUsuario);

          if (isDuplicate) {
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Aviso,
              mensagem: `O nome ${nomeValue} já existe na base de dados`
            });
            // Cortamos o fluxo devolvendo un observable baleiro sen facer o gardado
            return EMPTY;
          }

          if (this.idUsuario === 0) {
            return this.usuariosService.postUsuario(elemento).pipe(
              first(),
              tap(() => {
                this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Usuario engadido.' });
              })
            );
          } else {
            elemento.id = this.idUsuario;
            return this.usuariosService.putUsuario(elemento).pipe(
              first(),
              tap(() => {
                this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Usuario guardado.' });
              })
            );
          }
        })
      ).subscribe({
        error: (e: unknown) => {
          console.error(e);
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro,
            mensagem: this.idUsuario === 0
              ? 'Houbo um erro ao engadir o usuario.'
              : 'Houbo um erro ao guardar o usuario.'
          });
        }
      });
    }
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
