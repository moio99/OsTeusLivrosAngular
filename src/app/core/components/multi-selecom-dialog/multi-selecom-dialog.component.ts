import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { FiltroListDragPipe } from '../../../shared/pipes/filtro-list-drag.pipe';
import { CommonModule } from '@angular/common';

// https://stackblitz.com/edit/angular-htpgvx?file=src%2Fapp%2Fapp.component.ts

export interface MultiDados {
  total: SimpleObjet[];
  escolma: SimpleObjet[];
}

@Component({
  selector: 'omla-multi-selecom-dialog',
  standalone: true,
  imports: [ CommonModule, DragDropModule, FiltroListDragPipe ],
  templateUrl: './multi-selecom-dialog.component.html',
  styleUrls: ['./multi-selecom-dialog.component.scss']
})
export class MultiSelecomDialogComponent {

  dummy = 0;  // Para que estando aplicado o filtro, se dea conta de que houbo um cambio.
  filtro = '';
  multiDados: MultiDados = {total: [], escolma: []};

  constructor(
    public dialogRef: MatDialogRef<MultiSelecomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultiDados) {
      this.multiDados = data;
    }

  onFechar(): void {
    this.dialogRef.close(this.multiDados);
  }

  onCambioFiltro(input: any) {
    if (input)
      this.filtro = input.value;
  }

  onMover(event: CdkDragDrop<SimpleObjet[]>) {
    /* event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex, */
    let itemId = event.previousContainer.data[event.previousIndex].id;

    if (event.previousContainer.id == 'listadoTodo') {    // A accom tem origem no listado de Todo.
      let item = this.multiDados.total.find((x) => x.id == itemId);
      if (item) {
        this.multiDados.total = this.multiDados.total.filter(elemento => elemento.id !== itemId);

        this.multiDados.escolma.splice(event.currentIndex, 0, item);
      }
    }
    else {
      let item = this.multiDados.escolma.find((x) => x.id == itemId);
      if (item) {
        this.multiDados.escolma = this.multiDados.escolma.filter(elemento => elemento.id !== itemId);

        if (this.filtro) {
          if (item.value.includes(this.filtro)) {   // Se nom cumple o filtro.
            if (event.currentIndex == 0) {          // O está a meter polo começo
              this.multiDados.total.splice(0, 0, item);
            }
            else {
              let ind = event.container.data[event.currentIndex];
              if (ind) {
                let v = this.multiDados.total.findIndex(x => x.id == ind.id);
                this.multiDados.total.splice(v, 0, item);   // O meto na posiçom que o soltou.
              }
              else {                                // O está a meter polo final.
                this.multiDados.total.push(item);
              }
            }
          }
          else {
            this.multiDados.total.push(item);
          }
        }
        else {
          this.multiDados.total.splice(event.currentIndex, 0, item);
        }
      }
    }
    this.dummy++;
  }
}
