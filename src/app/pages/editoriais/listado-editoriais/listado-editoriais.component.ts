import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { first } from 'rxjs';
import { OrdeColunaComponent } from '../../../core/components/orde-coluna/orde-coluna.component';
import { ListadoEditoriais, ListadoEditoriaisData } from '../../../core/models/listado-editoriais.interface';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';
import { LayoutService } from '../../../core/services/flow/layout.service';
import { Ordeacom } from '../../../shared/classes/ordeacom';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { EditorialComponent } from '../editorial/editorial.component';
import { environment, environments } from '../../../../environments/environment';

@Component({
  selector: 'omla-listado-editoriais',
  standalone: true,
  imports: [CommonModule, OrdeColunaComponent],
  templateUrl: './listado-editoriais.component.html',
  styleUrls: ['./listado-editoriais.component.scss']
})
export class ListadoEditoriaisComponent implements OnInit {

  soVisualizar = environment.whereIAm === environments.pre || environment.whereIAm === environments.pro;
  nomeAlfabetico = ', alfabético';
  numeroLivros = ', número de livros';
  tipoOrdeacom = this.nomeAlfabetico;
  inverso = false;
  tipoListado = '';
  listadoDados: ListadoEditoriais[] = [];

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private editoriaisService: EditoriaisService) { }

  ngOnInit(): void {
    this.obterDadosDoListado();
  }

  private obterDadosDoListado(): void {
    this.editoriaisService
      .getListadoEditoriaisCosLivros()
      .pipe(first())
      .subscribe({
        next: (v: object) => this.listadoDados = this.dadosObtidos(v),
        error: (e: any) => { console.error(e),
          this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puiderom obter as editoriais.'}); },
          // complete: () => console.info('completado listado de editoriais')
    });
  }

  private dadosObtidos(data: object): ListadoEditoriais[] {
    let resultados: ListadoEditoriais[];
    const dados = <ListadoEditoriaisData>data;
    if (dados != null) {
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Info, mensagem: dados.data.length + ' registros obtidos'});
      resultados = dados.data.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
    } else {
      resultados = [];
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: 'Nom se obtiverom dados.'});
      console.debug('Nom se obtiverom dados');
    }
    return resultados
  }

  onBorrarElemento(id: string, nome: string, livros: number) {
    if (livros == 0) {
      if(confirm("Está certo de querer borrar a editorial " + nome + "?")) {
        this.editoriaisService
              .borrarEditorial(id)
              .pipe(first())
              .subscribe({
                next: (v: object) => console.debug(v),
                error: (e: any) => { console.error(e),
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Erro, mensagem: 'Nom se puido borrara a editirial.'}); },
                  complete: () => { // console.debug('Borrado feito'); this.obterDadosDoListado();
                  this.layoutService.amosarInfo({tipo: InformacomPeTipo.Sucesso, mensagem: 'Editorial borrada.'}); }
            });
      }
    }
    else {
      let pergunta = 'Nom se pode borrar a editorial ' + nome + ' mentres tenha ' + livros;
      let singular = ' livro asociado';
      let plural = ' livros asociados';
      this.layoutService.amosarInfo({tipo: InformacomPeTipo.Aviso, mensagem: pergunta + ((livros == 1) ? singular : plural)});
      alert(pergunta + ((livros == 1) ? singular : plural));
    }
  }

  ordeAlfabetico() {
    this.inverso = (this.tipoOrdeacom == this.nomeAlfabetico) ? !this.inverso : false;
    this.tipoOrdeacom = this.nomeAlfabetico;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.nome, b.nome, this.inverso));
  }

  ordeNumeroLivros() {
    this.inverso = (this.tipoOrdeacom == this.numeroLivros) ? !this.inverso : false;
    this.tipoOrdeacom = this.numeroLivros;

    this.listadoDados.sort((a,b) => new Ordeacom().ordear(a.quantidadeLivros, b.quantidadeLivros, this.inverso, false));
  }

  onIrPagina(rota: string, id: string): void{
    //this.userService.setModuleData(moduleData);   // Os dados vam no serviço
    this.layoutService.amosarInfo(undefined);
    this.layoutService.amosarInfo(undefined);
    this.router.navigateByUrl(rota + '?id=' + id);
    // this.router.navigate([rota], {relativeTo: id});
    // this.router.navigate([rota], {dadoQueVai: id});
  }
}

export const childRoutes: Routes = [
  {
    path: '',
    component: ListadoEditoriaisComponent,
  },
  {
    path: 'editorial',
    component: EditorialComponent
  }
];
