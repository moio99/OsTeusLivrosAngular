import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdeColunaComponent } from './orde-coluna.component';

describe('OrdeColunaComponent', () => {
  let component: OrdeColunaComponent;
  let fixture: ComponentFixture<OrdeColunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdeColunaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdeColunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
