import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrelaComponent } from './estrela.component';

describe('EstrelaComponent', () => {
  let component: EstrelaComponent;
  let fixture: ComponentFixture<EstrelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstrelaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstrelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
