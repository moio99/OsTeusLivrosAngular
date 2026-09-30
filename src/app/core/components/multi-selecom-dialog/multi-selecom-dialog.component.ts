import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { CommonModule } from '@angular/common';

export interface MultiDados {
  total: SimpleObjet[];
  escolma: SimpleObjet[];
}

@Component({
  selector: 'omla-multi-selecom-dialog',
  standalone: true,
  imports: [ CommonModule, DragDropModule ],
  templateUrl: './multi-selecom-dialog.component.html',
  styleUrls: ['./multi-selecom-dialog.component.scss']
})
export class MultiSelecomDialogComponent {
  // Inxeccións modernas de Angular 22 sen constructor clásico
  public readonly dialogRef = inject(MatDialogRef<MultiSelecomDialogComponent>);
  public readonly data = inject<MultiDados>(MAT_DIALOG_DATA);

  // Estados centrais baseados en Signals (Desaparece a variábel dummy!)
  protected readonly filtro = signal<string>('');

  // Inicializamos o Signal co obxecto completo que entra por inxección
  private readonly _multiDados = signal<MultiDados>({
    total: this.data?.total ? [...this.data.total] : [],
    escolma: this.data?.escolma ? [...this.data.escolma] : []
  });

  // Expoñemos as dúas listaxes de xeito independente para o HTML
  protected readonly escolma = computed(() => this._multiDados().escolma);

  protected readonly totalFiltrado = computed(() => {
    const listadoTodo = this._multiDados().total;
    const termo = this.filtro().trim().toLowerCase();

    if (!termo) return listadoTodo;

    return listadoTodo.filter(item =>
      item.value.toLowerCase().includes(termo)
    );
  });

  onFechar(): void {
    // Cando pechamos, devolvemos o valor actual do noso Signal central
    this.dialogRef.close(this._multiDados());
  }

  onCambioFiltro(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.filtro.set(inputElement.value); // Actualiza o Signal e o computed reacciona só
    }
  }

  onMover(event: CdkDragDrop<SimpleObjet[]>): void {
    // Extraemos o ID usando directamente o evento de Angular Material de xeito seguro
    const itemId = event.item.data?.id || event.previousContainer.data[event.previousIndex]?.id;
    if (!itemId) return;

    const datos = {
      total: [...this._multiDados().total],
      escolma: [...this._multiDados().escolma]
    };

    // CASO 1: De 'listadoTodo' para 'escolma'
    if (event.previousContainer.id === 'listadoTodo') {
      const item = datos.total.find(x => x.id === itemId);
      if (item) {
        datos.total = datos.total.filter(elemento => elemento.id !== itemId);
        datos.escolma.splice(event.currentIndex, 0, item);
      }
    }
    // CASO 2: De 'escolma' de volta a 'listadoTodo'
    else {
      const item = datos.escolma.find(x => x.id === itemId);
      if (item) {
        datos.escolma = datos.escolma.filter(elemento => elemento.id !== itemId);

        // Procuramos o elemento visual sobre o que se soltou no contenedor de destino
        const elementoDestinoVisual = event.container.data[event.currentIndex];

        if (elementoDestinoVisual) {
          // Se visualmente se soltou sobre alguén, buscamos a posición REAL dese veciño no array orixinal
          const indiceReal = datos.total.findIndex(x => x.id === elementoDestinoVisual.id);
          datos.total.splice(indiceReal, 0, item);
        } else {
          // Se non hai elemento nesa posición (soltouse ao final da lista visual), vai ao final do array
          datos.total.push(item);
        }
      }
    }

    // Notificamos o cambio ao Signal
    this._multiDados.set(datos);
  }

}
