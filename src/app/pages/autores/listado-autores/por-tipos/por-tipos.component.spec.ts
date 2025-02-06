import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { PorTiposComponent } from './por-tipos.component';
import { AutoresService } from '../../../../core/services/api/autores.service';

describe('PorTiposComponent', () => {
  let component: PorTiposComponent;
  let fixture: ComponentFixture<PorTiposComponent>;
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
      //declarations: [ PorTiposComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AutoresService, useValue: autoresServiceMock },
        // { provide: OutrosService, useValue: outrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorTiposComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


/* import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorTiposComponent } from './por-tipos.component';

describe('PorTiposComponent', () => {
  let component: PorTiposComponent;
  let fixture: ComponentFixture<PorTiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorTiposComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorTiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 */
