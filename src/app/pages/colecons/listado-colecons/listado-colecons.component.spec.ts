import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoColeconsComponent } from './listado-colecons.component';
import { ColeconsService } from '../../../core/services/api/colecons.service';

describe('ListadoColeconsComponent', () => {
  let component: ListadoColeconsComponent;
  let fixture: ComponentFixture<ListadoColeconsComponent>;

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

    await TestBed.configureTestingModule({
      //declarations: [ ListadoColeconsComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: ColeconsService, useValue: coleconsServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoColeconsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


