import { ComponentFixture, TestBed } from '@angular/core/testing';

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
