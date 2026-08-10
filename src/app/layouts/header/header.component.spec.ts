import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header.component';
import { LayoutService } from '../../core/services/flow/layout.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let layoutServiceMock: any;

  beforeEach(async () => {
    layoutServiceMock = {
      abrirMenu: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MatIconModule],
      //declarations: [HeaderComponent],    Isto nom vale porque é standalone
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call abrirMenu on layoutService when onAmosarMenu is called', () => {
    component.onAmosarMenu();
    expect(layoutServiceMock.abrirMenu).toHaveBeenCalled();
  });
});
