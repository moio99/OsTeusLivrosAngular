import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EditorialComponent } from './editorial.component';
import { EditoriaisService } from '../../../core/services/api/editoriais.service';
import { LivrosService } from '../../../core/services/api/livros.service';

describe('EditorialComponent', () => {
  let component: EditorialComponent;
  let fixture: ComponentFixture<EditorialComponent>;
  let activatedRoute: any;
  let editoriaisService: jest.Mocked<EditoriaisService>;

  beforeEach(async () => {
    const editoriaisServiceMock = {
      getEditorial: jest.fn(),
      postEditorial: jest.fn(),
      putEditorial: jest.fn(),
      getEditorialPorNome: jest.fn(),
    };

    const livrosServiceMock = {
      getListadoLivrosPorEditorial: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ EditorialComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: EditoriaisService, useValue: editoriaisServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorialComponent);
    component = fixture.componentInstance;
    editoriaisService = TestBed.inject(EditoriaisService) as jest.Mocked<EditoriaisService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
