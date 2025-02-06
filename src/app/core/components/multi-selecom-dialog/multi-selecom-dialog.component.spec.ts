import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MultiSelecomDialogComponent, MultiDados } from './multi-selecom-dialog.component';
import { SimpleObjet } from '../../../shared/models/outros.model';
import { FiltroListDragPipe } from '../../../shared/pipes/filtro-list-drag.pipe';
import { CommonModule } from '@angular/common';

describe('MultiSelecomDialogComponent', () => {
  let component: MultiSelecomDialogComponent;
  let fixture: ComponentFixture<MultiSelecomDialogComponent>;
  let dialogRefMock: any;
  let dataMock: MultiDados;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn()
    };

    dataMock = {
      total: [{ id: 1, value: 'Item 1' }, { id: 2, value: 'Item 2' }],
      escolma: [{ id: 3, value: 'Item 3' }]
    };

    await TestBed.configureTestingModule({
      // declarations: [MultiSelecomDialogComponent, FiltroListDragPipe],    nom por que é standalone
      imports: [MultiSelecomDialogComponent, FiltroListDragPipe, CommonModule, DragDropModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dataMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelecomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with multiDados on onFechar', () => {
    component.onFechar();
    expect(dialogRefMock.close).toHaveBeenCalledWith(component.multiDados);
  });

  it('should update filtro on onCambioFiltro', () => {
    const inputMock = { value: 'test filtro' };
    component.onCambioFiltro(inputMock);
    expect(component.filtro).toBe('test filtro');
  });

  it('should move item from total to escolma on onMover', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoTodo', data: component.multiDados.total },
      container: { id: 'listadoEscolma', data: component.multiDados.escolma },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: { id: 1, value: 'Item 1' } }
    } as any;

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(1);
    expect(component.multiDados.escolma.length).toBe(2);
  });

  it('should move item from escolma to total on onMover', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoEscolma', data: component.multiDados.escolma },
      container: { id: 'listadoTodo', data: component.multiDados.total },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: { id: 3, value: 'Item 3' } }
    } as any;

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(3);
    expect(component.multiDados.escolma.length).toBe(0);
  });

  it('should move item from escolma to total on onMover e com filtro NOM coincidente', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoEscolma', data: component.multiDados.escolma },
      container: { id: 'listadoTodo', data: component.multiDados.total },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: { id: 3, value: 'Item 3' } }
    } as any;

    const inputMock = { value: 'NOM Item 3' };
    component.onCambioFiltro(inputMock);

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(3);
    expect(component.multiDados.escolma.length).toBe(0);
  });

  it('should move item from escolma to total on onMover e com filtro SIM coincidente Metido polo começo 0', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoEscolma', data: component.multiDados.escolma },
      container: { id: 'listadoTodo', data: component.multiDados.total },
      previousIndex: 0,
      currentIndex: 0,
      item: { data: { id: 3, value: 'Item 3' } }
    } as any;

    const inputMock = { value: 'Item 3' };
    component.onCambioFiltro(inputMock);

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(3);
    expect(component.multiDados.escolma.length).toBe(0);
    expect(component.multiDados.total[0].value).toBe(inputMock.value);
  });

  it('should move item from escolma to total on onMover e com filtro SIM coincidente Metido polo medio', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoEscolma', data: component.multiDados.escolma },
      container: { id: 'listadoTodo', data: component.multiDados.total },
      previousIndex: 0,
      currentIndex: 1,
      item: { data: { id: 3, value: 'Item 3' } }
    } as any;

    const inputMock = { value: 'Item 3' };
    component.onCambioFiltro(inputMock);

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(3);
    expect(component.multiDados.escolma.length).toBe(0);
    expect(component.multiDados.total[1].value).toBe(inputMock.value);
  });
  it('should move item from escolma to total on onMover e com filtro SIM coincidente Metido polo final', () => {
    const eventMock: CdkDragDrop<SimpleObjet[]> = {
      previousContainer: { id: 'listadoEscolma', data: component.multiDados.escolma },
      container: { id: 'listadoTodo', data: component.multiDados.total },
      previousIndex: 0,
      currentIndex: 2,
      item: { data: { id: 3, value: 'Item 3' } }
    } as any;

    const inputMock = { value: 'Item 3' };
    component.onCambioFiltro(inputMock);

    component.onMover(eventMock);
    expect(component.multiDados.total.length).toBe(3);
    expect(component.multiDados.escolma.length).toBe(0);
    expect(component.multiDados.total[2].value).toBe(inputMock.value);
  });
});
