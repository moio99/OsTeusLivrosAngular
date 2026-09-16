import { Component, signal, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, concatMap, EMPTY, first, map, of, tap } from 'rxjs';
import { Autor, ListadoLivros } from '@interfaces';
import { EstadosPagina } from '../../../shared/enums/estadosPagina';
import { AutoresService, LivrosService, OutrosService } from '@servizosApi';
import { DadosComplentarios, InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { Nacionalidade, SimpleObjet, Pais } from '../../../shared/models/outros.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutorFormPresenterComponent } from './autor-form-presenter.component';
import { AutorFormStateService } from './autor-form-state.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ListadoLivrosElementoComponent } from '../../../core/components/listado-livros-elemento/listado-livros-elemento.component';
import { BaseElementoSignalsComponent } from '../../../core/components/base/elemento/base-elemento-signals.component';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-autor',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule,
    MatNativeDateModule, MatAutocompleteModule, AutorFormPresenterComponent, ListadoLivrosElementoComponent ],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss'],
  providers: [AutorFormStateService]
})
export class AutorComponent extends BaseElementoSignalsComponent<Autor> {

  private route = inject(ActivatedRoute);
  private outrosService = inject(OutrosService);
  private autoresService = inject(AutoresService);
  private livrosService = inject(LivrosService);

  private readonly formState = inject(AutorFormStateService);

  estadosPagina = EstadosPagina;
  dadosDoAutor: Autor | undefined = undefined;
  dadosLivrosDoAutor = signal<ListadoLivros[]>([]);
  date = new Date();

  idAutor = toSignal(
    this.route.queryParams.pipe(
      map(params => params['id'] ?? '0')
    ),
    { initialValue: '0' }
  );
  modo = computed(() => {
    if (environment.whereIAm === environments.pre || environment.whereIAm === environments.pro) {
      return EstadosPagina.soVisualizar;
    };
    return this.idAutor() === '0' ? EstadosPagina.engadir : EstadosPagina.guardar;
  });

  nacionalidadesResource = rxResource({
    stream: () => {
      const cache = this.dadosOutrosService.getDadosOutrosCache();
      // Se xa están en caché, devolvemos un observable inmediato para non ir ao servidor
      if (cache?.nacionalidades) return of(cache.nacionalidades);

      return this.outrosService.getNacionalidades().pipe(
        first(),
        catchError((e) => this.manexarErroSoporte(e, 'das nacionalidades'))
      );
    }
  });

  paisesResource = rxResource({
    stream: () => {
      // Se xa están en caché, devolvemos un observable inmediato para non ir ao servidor
      const cache = this.dadosOutrosService.getDadosOutrosCache();
      if (cache?.paises) return of(cache.paises);

      return this.outrosService.getPaises().pipe(
        first(),
        catchError((e) => this.manexarErroSoporte(e, 'dos países'))
      );
    }
  });

  livrosAutorResource = rxResource({
    params: () => this.idAutor(),
    stream: ({ params: id }) => {
      const currentId = id;
      return this.livrosService.getLivrosPorAutor(currentId).pipe(
        first(),
        map(v => this.dadosLivrosElementoObtidos(v)),
        catchError((e) => this.manexarErroSoporte(e, 'dos livros do autor'))
      );
    }
  });

  autorResource = rxResource({
    params: () => this.idAutor(),
    stream: ({ params: id }) => {
      const currentId = id;

      // Se o ID é '0' (modo engadir), non facemos petición HTTP e devolvemos null
      if (!currentId || currentId === '0') return of(null);

      return this.autoresService.getAutor(currentId).pipe(
        first(),
        map(v => this.dadosObtidos(v)),
        catchError((e) => {
          this.manexarErroSoporte(e, 'do autor');
          return of(null); })
      );
    }
  });

  constructor() {
    super();

    // Sincroniza as nacionalidades co FormState cando carguen
    effect(() => {
      const data = this.nacionalidadesResource.value();
      if (data) {
        this.formState.setNacionalidades(this.reducirDadosGerais(data));
      }
    });

    // Sincroniza os países co FormState cando carguen
    effect(() => {
      const data = this.paisesResource.value();
      if (data) {
        this.formState.setPaises(this.reducirDadosGerais(data));
      }
    });

    // Sincroniza os datos do autor (Se os necesitas nunha propiedade local)
    effect(() => {
      const autor = this.autorResource.value();

      if (autor && !this.dadosDoAutor) {
        this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom chegarom dados do autor'});
      }

      // Lemos os estados de carga dos outros dous recursos
      const nacionalidadesListas = this.nacionalidadesResource.hasValue();
      const paisesListos = this.paisesResource.hasValue();

      // Se o autor chegou, pero os combos aínda non teñen datos, AGARDAMOS.
      // O effect volverá a executarse automaticamente en canto as outras sinais cambien.
      if (autor && nacionalidadesListas && paisesListos && this.dadosDoAutor) {
        this.formState.atualizarFromAutor(this.dadosDoAutor); // Establece os datos para o formulario
      }
    });

    effect(() => {
      const autor = this.autorResource.value();
      const libros = this.livrosAutorResource.value();
      if (autor && autor.id > 0 && this.livrosAutorResource.hasValue() && libros?.length === 0) {
        this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados dos livros do autor' });
      }
    });
  }

  private reducirDadosGerais(data: any): SimpleObjet[] {
    const dados = data as { data: Array<Nacionalidade | Pais> };
    if (!dados?.data) {
      return [];
    }

    return dados.data.map(value => ({
      id: value.id,
      value: value.nome
    }));
  }

  onSubmit(event: SubmitEvent) {
    if (this.formState.autorForm().invalid()) return;

    const botonPremido = (event.submitter as HTMLButtonElement)?.value;
    const nomeFormulario = String(this.formState.autorForm.nome().value()).trim();

    this.autoresService.getAutorPorNome(nomeFormulario).pipe(
      first(),  // Collo o primeiro valor da consulta do nome e pechamos esa canle
      concatMap((autorRepetido) => {  // concatMap asegura que a seguinte chamada agarde a que esta remate sem cancelarse
        if (autorRepetido && autorRepetido.meta.quantidade > 0) {
          if (botonPremido === EstadosPagina.engadir || autorRepetido.meta.id !== this.dadosDoAutor?.id) {
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Aviso,
              mensagem: 'O nome do autor já existe na base de dados'
            });
            return EMPTY; // Corta o fluxo de forma segura se está repetido
          }
        }

        const autor = this.formState.criarObjetoAutor(this.dadosDoAutor?.id);
        if (botonPremido === EstadosPagina.engadir) {
          return this.autoresService.postAutor(autor).pipe(
            first(),
            tap((v) => {
              this.gestionarRetroceso(v, autor, DadosComplentarios.Autor);
              this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor engadido.' });
            })
          );
        } else {
          return this.autoresService.putAutor(autor).pipe(
            first(),
            tap((v) => {
              this.gestionarRetroceso(v, autor, DadosComplentarios.Autor);
              this.layoutService.amosarInfo({ tipo: InformacomPeTipo.Sucesso, mensagem: 'Autor guardado.' });
            })
          );
        }
      })
    ).subscribe({
      next: () => {
        console.debug('Proceso finalizado');
      },
      error: (e: unknown) => {
        console.error(e);
        this.layoutService.amosarInfo({
          tipo: InformacomPeTipo.Erro,
          mensagem: botonPremido === EstadosPagina.engadir
            ? 'Houbo un erro ao engadir o autor.'
            : 'Houbo un erro ao guardar o autor.'
        });
      }
    });
  }

  protected override aplicarDatosAoFormulario(datos: Autor): void {
    this.dadosDoAutor = datos;
    // Nom fago isto para aguardar a que chegem os dados dos combos. this.formState.atualizarFromAutor(datos);
  }
}
