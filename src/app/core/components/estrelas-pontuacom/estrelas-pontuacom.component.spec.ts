import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrelasPontuacomComponent } from './estrelas-pontuacom.component';

describe('EstrelasPontuacomComponent', () => {
  let component: EstrelasPontuacomComponent;
  let fixture: ComponentFixture<EstrelasPontuacomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstrelasPontuacomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstrelasPontuacomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
