import { Component, computed, inject, signal } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '@servizosFlow';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { BaseListadoDadosApi } from '../../../../shared/models/base-dados';
import { ParametrosAutor } from '@interfaces';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  template: '' // Componente abstracto, nom precisa template
})
export abstract class BaseListadoComponent<T extends { id: string }> {

  protected abstract nomePlural: string;

  readonly layoutService = inject(LayoutService);
  readonly router = inject(Router);
  protected readonly translocoService = inject(TranslocoService);

  // Cada componhente filho implementará este método para dicir de onde saca os dados
  protected abstract definirChamadaApi(params?: any): Observable<BaseListadoDadosApi<any>>;

  protected abstract parametrosBusqueda: any;

  // O recurso encarregase de subscribirse, fazer o unsubscribe automático e jestionar o estado (loading, error, etc.)
  protected readonly listadoResource = rxResource({
    params: () => this.parametrosBusqueda(),    // Qando os parámetros cambiem relanzara-se o stream, se fossem undefined o stream non se ejecutará
    stream: (parametrosSoAutor) => {
      return this.definirChamadaApi(parametrosSoAutor).pipe(
        tap({
          next: (resposta) => {
            const rexistros = resposta?.data ?? [];
            if (rexistros.length > 0) {
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Info,
                mensagem: this.translocoService.translate('common.recordsLoaded', { count: rexistros.length })
              });
            } else {
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Aviso,
                mensagem: this.translocoService.translate('common.noData')
              });
            }
          },
          error: (e) => {
            console.error(e);
            this.layoutService.amosarInfo({
              tipo: InformacomPeTipo.Erro,
              mensagem: this.translocoService.translate('common.loadError')
            });
          }
        })
      );
    }
  });



  // O recurso encarregase de subscribirse, fazer o unsubscribe automático e jestionar o estado (loading, error, etc.)
  // protected readonly listadoResource = rxResource({
  //   stream: () => {
  //     const chamada$ = this.definirChamadaApi();

  //     // Ejecutamos efectos secundarios (mensagens e caché) de jeito declarativo
  //     chamada$.subscribe({
  //       next: (resposta) => {
  //         const rexistros = resposta?.data ?? [];
  //         if (rexistros.length > 0) {
  //           this.layoutService.amosarInfo({
  //             tipo: InformacomPeTipo.Info,
  //             mensagem: `${rexistros.length} registros obtidos`
  //           });
  //         } else {
  //           this.layoutService.amosarInfo({
  //             tipo: InformacomPeTipo.Aviso,
  //             mensagem: 'Nom se obtiverom dados.'
  //           });
  //         }
  //       },
  //       error: (e) => {
  //         console.error(e);
  //         this.layoutService.amosarInfo({
  //           tipo: InformacomPeTipo.Erro,
  //           mensagem: `Nom se puiderom obter ${this.nomePlural}.`
  //         });
  //       }
  //     });

  //     return chamada$;
  //   }
  // });

  // Fai um cast seguro "as unknown as T[]" para solucionar o conflito de tipos Colecom/ListadoColecons
  readonly listadoDados = computed<T[]>(() => {
    const respostaApi = this.listadoResource.value();
    return (respostaApi?.data ?? []) as unknown as T[];
  });

  protected onBorrarElemento(
    id: string,
    livros: number,
    nomeDoElemento: string,
    _nomeComArtigo: string,
    _successMessage: string = 'Elemento borrado correctamente',
    serviceDelete: (id: string) => Observable<unknown>,
    borrarElementoDadosOutros?: (id: string) => void     // Se se passa este parámetro, borrar o elemento da caché (outros)
  ): void {

    if (livros === 0) {
      if (confirm(this.translocoService.translate('common.confirmDelete', { name: nomeDoElemento }))) {
        serviceDelete(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.listadoResource.reload();
              if (borrarElementoDadosOutros) {
                borrarElementoDadosOutros(id);
              }
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Sucesso,
                mensagem: this.translocoService.translate('common.itemDeleted', { name: nomeDoElemento })
              });
            },
            error: (e: unknown) => {
              console.error(e);
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Erro,
                mensagem: this.translocoService.translate('common.deleteError', { name: nomeDoElemento })
              });
            }
          });
      }
    } else {
      const mensagem = this.translocoService.translate('common.deleteBlocked', {
        name: nomeDoElemento,
        count: livros
      });

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
