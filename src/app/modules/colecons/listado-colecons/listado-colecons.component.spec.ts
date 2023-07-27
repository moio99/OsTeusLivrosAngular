import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoColeconsComponent } from './listado-colecons.component';

describe('ListadoColeconsComponent', () => {
  let component: ListadoColeconsComponent;
  let fixture: ComponentFixture<ListadoColeconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoColeconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoColeconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
