import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEditoriaisComponent } from './listado-editoriais.component';

describe('ListadoEditoriaisComponent', () => {
  let component: ListadoEditoriaisComponent;
  let fixture: ComponentFixture<ListadoEditoriaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoEditoriaisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoEditoriaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
