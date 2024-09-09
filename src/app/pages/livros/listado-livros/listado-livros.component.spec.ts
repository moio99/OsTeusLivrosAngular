import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoLivrosComponent } from './listado-livros.component';

describe('ListadoLivrosComponent', () => {
  let component: ListadoLivrosComponent;
  let fixture: ComponentFixture<ListadoLivrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoLivrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoLivrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
