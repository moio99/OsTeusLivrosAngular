import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnosPaginasIdiomasComponent } from './anos-paginas-idiomas.component';

describe('AnosPaginasIdiomasComponent', () => {
  let component: AnosPaginasIdiomasComponent;
  let fixture: ComponentFixture<AnosPaginasIdiomasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnosPaginasIdiomasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnosPaginasIdiomasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
