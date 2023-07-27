import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColecomComponent } from './colecom.component';

describe('ColecomComponent', () => {
  let component: ColecomComponent;
  let fixture: ComponentFixture<ColecomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColecomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColecomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
