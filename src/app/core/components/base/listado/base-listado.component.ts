import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { InformacomPeTipo } from '../../../../shared/enums/estadisticasTipos';
import { LayoutService } from '../../../services/flow/layout.service';
import { Observable } from 'rxjs';

@Component({
  template: '' // Componente abstracto, nom precisa template
})
export abstract class BaseListadoComponent<T extends { id: string }> {
  @Input() listadoDados: T[] = [];

  constructor(
    protected layoutService: LayoutService) {}

  protected obterDadosDoListado<TData extends IData>(
    nomePlural: string,
    serviceCall: Observable<TData>,
    serviceSetCache: (dados: TData) => void
  ): void {
    serviceCall
      .pipe(first())
      .subscribe({
        next: (v: any) => this.listadoDados = this.dadosObtidos(v, serviceSetCache),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: `Nom se puiderom obter ${nomePlural}.`}); },
          // complete: () => console.info('completado listado de coleçons')
    });
  }

  private dadosObtidos<TData extends IData>(
    data: object,
    serviceSetCache: (dados: TData) => void
  ): T[] {
    let resultados: T[];
    const dados = <TData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      serviceSetCache(dados);
      resultados = dados.data;
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  protected onBorrarElemento(
    id: string,
    livros: number,
    nomeDoElmento: string,
    nomeComArtigo: string,
    successMessage: string = 'Elemento borrado correctamente',
    serviceDelete: (id: string) => any
  ) {
    if (livros === 0) {
      if (confirm(`Está certo de querer borrar ${nomeComArtigo} ${nomeDoElmento}?`)) {
        serviceDelete(id)
          .pipe(first())
          .subscribe({
            next: (v: any) => {
              this.listadoDados = this.listadoDados.filter(
                item => item.id.toString() !== v.idResult?.toString()
              );
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Sucesso,
                mensagem: successMessage
              });
            },
            error: (e: any) => {
              console.error(e);
              this.layoutService.amosarInfo({
                tipo: InformacomPeTipo.Erro,
                mensagem: `Nom se puido borrar ${nomeComArtigo}.`
              });
            }
          });
      }
    } else {
      const plural = livros === 1 ? 'livro asociado' : 'livros asociados';
      const mensagem = `Nom se puede borrar ${nomeComArtigo} mentre tenha ${livros} ${plural}`;

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
