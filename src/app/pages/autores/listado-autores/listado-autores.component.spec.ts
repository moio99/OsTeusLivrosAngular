import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAutoresComponent } from './listado-autores.component';
import { AutoresService } from '../../../core/services/api/autores.service';
import { ActivatedRoute } from '@angular/router';
import { OutrosService } from '../../../core/services/api/outros.service';

describe('ListadoAutoresComponent', () => {
  let component: ListadoAutoresComponent;
  let fixture: ComponentFixture<ListadoAutoresComponent>;
  let activatedRoute: any;

  beforeEach(async () => {
    const autoresServiceMock = {
      getListadoAutores: jest.fn(),
      getListadoAutoresPorNacons: jest.fn(),
      getListadoAutoresPorPaises: jest.fn(),
      getListadoAutoresFiltrados: jest.fn(),
      getAutor: jest.fn(),
      getAutorPorNome: jest.fn(),
      postAutor: jest.fn(),
      putAutor: jest.fn(),
      borrarAutor: jest.fn()
    };

    const outrosServiceMock = {
      getNacionalidades: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ ListadoAutoresComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AutoresService, useValue: autoresServiceMock },
        { provide: OutrosService, useValue: outrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoAutoresComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
