import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LayoutService } from '@servizosFlow';
import { MatIconModule } from '@angular/material/icon';
import { CarregandoService } from '../../core/services/tools/carregando.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MatSelectModule } from '@angular/material/select';
import { Ordeacom } from '../../shared/classes/ordeacom';
import { LINGUAS, Linguas } from '../../shared/list/idiomas';

@Component({
  selector: 'omla-header',
  standalone: true,
  imports: [MatIconModule, TranslocoPipe, MatSelectModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  linguas = LINGUAS;
  obxectoSeleccionado: Linguas = LINGUAS[0];

  @ViewChild('selectLingua') selectLingua!: ElementRef<HTMLSelectElement>;

  private readonly layoutService = inject(LayoutService);
  private readonly carregandoService = inject(CarregandoService);
  private readonly translocoService = inject(TranslocoService);

  // protected readonly isAmosarCarregando = toSignal(
  //   this.carregandoService.carregando$,
  //   { initialValue: false } // Valor inicial por defecto
  // );
  protected readonly isAmosarCarregando = this.carregandoService.carregando;  // É um signal

  ngOnInit(): void {
    const linguasOrdeadas = this.linguas.sort((a, b) =>
        new Ordeacom().ordear(a.nome, b.nome, false));
    const linguaUsuario = this.translocoService.getActiveLang();
    const lingua = linguasOrdeadas.find(l => l.codigo === linguaUsuario);
    if (lingua) {
      this.obxectoSeleccionado = lingua;

      // Engadimos isto para forzar a selección visual no DOM:
      // Usamos setTimeout para asegurarnos de que Angular xa pintou as <option>
      setTimeout(() => {
        if (this.selectLingua) {
          this.selectLingua.nativeElement.value = lingua.codigo;
        }
      });
    }
  }

  onAmosarMenu(): void {
    this.layoutService.abrirMenu();
  }

  trocarIdioma(valor: Event) {
    const selectElement = valor.target as HTMLSelectElement;
    const idioma = selectElement.value;

    const idiomaSeleccionado = this.linguas.find(l => l.codigo === idioma);
    if (idiomaSeleccionado) {
      this.translocoService.setActiveLang(idiomaSeleccionado.codigo);
    }
  }
}
