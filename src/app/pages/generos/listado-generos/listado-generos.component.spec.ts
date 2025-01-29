import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGenerosComponent } from './listado-generos.component';
import { GenerosService } from '../../../core/services/api/generos.service';

describe('ListadoGenerosComponent', () => {
  let component: ListadoGenerosComponent;
  let fixture: ComponentFixture<ListadoGenerosComponent>;

  beforeEach(async () => {
    const generosServiceMock = {
      getGenero: jest.fn(),
      postGenero: jest.fn(),
      putGenero: jest.fn(),
      getGeneroPorNome: jest.fn(),
    };

    await TestBed.configureTestingModule({
      //declarations: [ ListadoGenerosComponent ],    Isto nom vale porque é standalone
      providers: [
        { provide: GenerosService, useValue: generosServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoGenerosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
