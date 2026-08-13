import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { CommonModule } from '@angular/common';

// https://stackblitz.com/edit/angular-htpgvx?file=src%2Fapp%2Fapp.component.ts

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
    const itemId = event.previousContainer.data[event.previousIndex].id;

    // Extraemos o estado actual de xeito inmutable (unha copia limpa para traballar)
    const datos = {
      total: [...this._multiDados().total],
      escolma: [...this._multiDados().escolma]
    };

    if (event.previousContainer.id === 'listadoTodo') {
      const item = datos.total.find(x => x.id === itemId);
      if (item) {
        datos.total = datos.total.filter(elemento => elemento.id !== itemId);
        datos.escolma.splice(event.currentIndex, 0, item);
      }
    } else {
      const item = datos.escolma.find(x => x.id === itemId);
      if (item) {
        datos.escolma = datos.escolma.filter(elemento => elemento.id !== itemId);

        if (this.filtro()) {
          if (item.value.toLowerCase().includes(this.filtro().toLowerCase())) {
            if (event.currentIndex === 0) {
              datos.total.splice(0, 0, item);
            } else {
              const ind = event.container.data[event.currentIndex];
              if (ind) {
                const v = datos.total.findIndex(x => x.id === ind.id);
                datos.total.splice(v, 0, item);
              } else {
                datos.total.push(item);
              }
            }
          } else {
            datos.total.push(item);
          }
        } else {
          datos.total.splice(event.currentIndex, 0, item);
        }
      }
    }

    // Notificamos a Angular pasándolle o novo obxecto
    this._multiDados.set(datos);
  }
}
