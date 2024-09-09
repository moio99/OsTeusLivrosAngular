import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoBibliotecasComponent } from './listado-bibliotecas.component';

describe('ListadoBibliotecasComponent', () => {
  let component: ListadoBibliotecasComponent;
  let fixture: ComponentFixture<ListadoBibliotecasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoBibliotecasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoBibliotecasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
