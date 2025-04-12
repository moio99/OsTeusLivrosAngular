import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { LayoutService } from '../../core/services/flow/layout.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let layoutServiceMock: any;

  beforeEach(async () => {
    layoutServiceMock = {
      cerrarMenu: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      //declarations: [MenuComponent],    Isto nom vale porque é standalone
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call cerrarMenu on layoutService when onFecharMenu is called', () => {
    component.onFecharMenu();
    expect(layoutServiceMock.cerrarMenu).toHaveBeenCalled();
  });
});
