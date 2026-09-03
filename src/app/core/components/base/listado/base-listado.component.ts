import { Component, computed, inject } from '@angular/core';
import { first } from 'rxjs/operators';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '@servizosFlow';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { BaseListadoDadosApi } from '../../../../shared/models/base-dados';

@Component({
  template: '' // Componente abstracto, nom precisa template
})
export abstract class BaseListadoComponent<T extends { id: string }> {

  protected abstract nomePlural: string;

  readonly layoutService = inject(LayoutService);
  readonly router = inject(Router);

  // Cada componhente filho implementará este método para dicir de onde saca os dados
  protected abstract definirChamadaApi(): Observable<BaseListadoDadosApi<any>>;
  // funçom para guardar na caché
  protected abstract guardarNaCache(dados: BaseListadoDadosApi<any>): void;

  // O recurso encarregase de subscribirse, fazer o unsubscribe automático e jestionar o estado (loading, error, etc.)
  protected readonly listadoResource = rxResource({
    stream: () => {
      const chamada$ = this.definirChamadaApi();

      // Ejecutamos efectos secundarios (mensagens e caché) de jeito declarativo
      chamada$.subscribe({
        next: (resposta) => {
          const rexistros = resposta?.data ?? [];
          if (rexistros.length > 0) {
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Info,
              mensagem: `${rexistros.length} registros obtidos`
            });
            this.guardarNaCache(resposta);
          } else {
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Aviso,
              mensagem: 'Nom se obtiverom dados.'
            });
          }
        },
        error: (e) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: `Nom se puiderom obter ${this.nomePlural}.`
          });
        }
      });

      return chamada$;
    }
  });

  // Fai um cast seguro "as unknown as T[]" para solucionar o conflito Colecom/ListadoColecons
  readonly listadoDados = computed<T[]>(() => {
    const respostaApi = this.listadoResource.value();
    return (respostaApi?.data ?? []) as unknown as T[];
  });

  protected onBorrarElemento(
    id: string,
    livros: number,
    nomeDoElemento: string,
    nomeComArtigo: string,
    successMessage: string = 'Elemento borrado correctamente',
    serviceDelete: (id: string) => Observable<unknown>
  ): void {

    if (livros === 0) {
      if (confirm(`Está certo de querer borrar ${nomeComArtigo} ${nomeDoElemento}?`)) {
        serviceDelete(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.listadoResource.reload();

              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Sucesso,
                mensagem: successMessage
              });
            },
            error: (e: unknown) => {
              console.error(e);
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Erro,
                mensagem: `Nom se pode apagar ${nomeComArtigo}.`
              });
            }
          });
      }
    } else {
      const plural = livros === 1 ? 'livro associado' : 'livros associados';
      const mensagem = `Nom se pode apagar ${nomeComArtigo} mentres tenha ${livros} ${plural}`;

      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Aviso,
        mensagem: mensagem
      });
      alert(mensagem);
    }
  }

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}
