import { Component, input, signal } from '@angular/core';
import { first } from 'rxjs/operators';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../services/flow/layout.service';
import { Observable } from 'rxjs';

@Component({
  template: '' // Componente abstracto, nom precisa template
})
export abstract class BaseListadoComponent<T extends { id: string }> {
  readonly listadoDadosInput = input<T[]>([]);  // nom o neccesito
  readonly listadoDados = signal<T[]>([]);

  constructor(protected layoutService: LayoutService) {}

  protected obterDadosDoListado<TData extends IData>(
    nomePlural: string,
    serviceCall: Observable<TData>,
    serviceSetCache: (dados: TData) => void
  ): void {
    serviceCall
      .pipe(first())
      .subscribe({
        next: (v) => {
          this.listadoDados.set(this.dadosObtidos(v, serviceSetCache));
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

  private dadosObtidos<TData extends IData>(
    data: TData,
    serviceSetCache: (dados: TData) => void
  ): T[] {
    const rexistros = data?.data ?? [];

    if (rexistros.length > 0) {
      this.layoutService.amosarInfo({
        tipo: InformacomPeTipo.Info,
        mensagem: `${rexistros.length} registros obtidos`
      });
      serviceSetCache(data);
      return rexistros as T[];
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
    serviceDelete: (id: string) => Observable<unknown>
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

}

interface IData {
  data: any[];
}
