import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEditoriaisComponent } from './listado-editoriais.component';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';

describe('ListadoEditoriaisComponent', () => {
  let component: ListadoEditoriaisComponent;
  let fixture: ComponentFixture<ListadoEditoriaisComponent>;

  beforeEach(async () => {
    const editoriaisServiceMock = {
      getListadoEditoriais: jest.fn(),
      getListadoEditoriaisCosLivros: jest.fn(),
      getEditorial: jest.fn(),
      getEditorialPorNome: jest.fn(),
      postEditorial: jest.fn(),
      putEditorial: jest.fn(),
      borrarEditorial: jest.fn()
    };

    await TestBed.configureTestingModule({
      //declarations: [ ListadoEditoriaisComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: EditoriaisService, useValue: editoriaisServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoEditoriaisComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

