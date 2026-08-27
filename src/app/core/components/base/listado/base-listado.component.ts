import { Component, inject, input, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '@servizosFlow';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BaseListadoDadosApi } from '@interfaces';

@Component({
  template: '' // Componente abstracto, nom precisa template
})
export abstract class BaseListadoComponent<T extends { id: string }> {
  readonly listadoDados = signal<T[]>([]);

  readonly layoutService = inject(LayoutService);
  readonly router = inject(Router);

  protected obterDadosDoListado<TData>(
    nomePlural: string,
    serviceCall: Observable<BaseListadoDadosApi<TData>>,
    serviceSetCache: (dados: BaseListadoDadosApi<TData>) => void
  ): void {
    serviceCall
      .pipe(first())
      .subscribe({
        next: (v) => {
          // ATENCIÓN: Como TData e T son diferentes, aquí facemos un cast seguro (as unknown as T[])
          const rexistros = this.dadosObtidos(v, serviceSetCache) as unknown as T[];
          this.listadoDados.set(rexistros);
        },
        error: (e) => {
          console.error(e);
          this.layoutService.amosarInfo({
            tipo: InformacomPeTipo.Erro,
            mensagem: `Nom se puiderom obter ${nomePlural}.`
          });
        }
      });
  }

  private dadosObtidos<TData>(
    data: BaseListadoDadosApi<TData>,
    serviceSetCache: (dados: BaseListadoDadosApi<TData>) => void
  ): TData[] {
    const rexistros = data?.data ?? [];

    if (rexistros.length > 0) {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Info,
        mensagem: `${rexistros.length} registros obtidos`
      });
      serviceSetCache(data);
      return rexistros;
    }

    this.layoutService.amosarInfo({
      tipo: InformacomPeTipo.Aviso,
      mensagem: 'Nom se obtiverom dados.'
    });
    console.debug('Nom se obtiverom dados');
    return [];
  }

  protected onBorrarElemento(
    id: string,
    livros: number,
    nomeDoElemento: string,
    nomeComArtigo: string,
    successMessage: string = 'Elemento borrado correctamente',
    serviceDelete: (id: string) => Observable<unknown>,
    actualizarListado?: () => void
  ): void {

    if (livros === 0) {
      if (confirm(`Está certo de querer borrar ${nomeComArtigo} ${nomeDoElemento}?`)) {
        serviceDelete(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.listadoDados.update(dados =>
                dados.filter(item => item.id.toString() !== id.toString())
              );

              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Sucesso,
                mensagem: successMessage
              });

              if (actualizarListado) {
                actualizarListado();
              }
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
