import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeComponent } from './pe.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PeComponent', () => {
  let component: PeComponent;
  let fixture: ComponentFixture<PeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // declarations: [ PeComponent ]  nom é standalone
      imports: [ PeComponent, NoopAnimationsModule ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
