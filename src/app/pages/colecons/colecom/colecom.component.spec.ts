import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ColecomComponent } from './colecom.component';
import { ColeconsService } from '../../../core/services/api/colecons.service';
import { LivrosService } from '../../../core/services/api/livros.service';

describe('ColecomComponent', () => {
  let component: ColecomComponent;
  let fixture: ComponentFixture<ColecomComponent>;
  let activatedRoute: any;

  beforeEach(async () => {
    const coleconsServiceMock = {
      getListadoColecons: jest.fn(),
      getListadoColeconsCosLivros: jest.fn(),
      getColecom: jest.fn(),
      getColecomPorNome: jest.fn(),
      postColecom: jest.fn(),
      putColecom: jest.fn(),
      borrarColecom: jest.fn()
    };

    const livrosServiceMock = {
      getListadoLivrosPorEditorial: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ ColecomComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ColeconsService, useValue: coleconsServiceMock },
        { provide: LivrosService, useValue: livrosServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColecomComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
