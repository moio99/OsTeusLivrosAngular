import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LayoutService } from './core/services/flow/layout.service';
import { UsuarioAppService } from './core/services/flow/usuario-app.service';
import { of } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let layoutServiceStub: Partial<LayoutService>;
  let usuarioAppServiceStub: Partial<UsuarioAppService>;

  beforeEach(async () => {
    layoutServiceStub = {
      getAbrirMenu: jest.fn(() => of(undefined)),  // Simular el observable para abrir
      getCerrarMenu: jest.fn(() => of(undefined))   // Simular el observable para cerrar
    };

    usuarioAppServiceStub = {
      setInformacom: jest.fn()  // Espía de la función que se llama en ngOnInit
    };

    await TestBed.configureTestingModule({
      // declarations: [AppComponent],                  Isto nom vale porque é standalone
      imports: [AppComponent, NoopAnimationsModule ],
      providers: [
        { provide: LayoutService, useValue: layoutServiceStub },
        { provide: UsuarioAppService, useValue: usuarioAppServiceStub },
        { provide: ActivatedRoute, useValue: {} } // Proveer un stub para ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // component.panelRef = {} as MatSidenav; // Erro, correçom abaixo
    component.panelRef = {
      open: jest.fn(),
      close: jest.fn()
    }  as unknown as MatSidenav; // Simula el ViewChild MatSidenav
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setInformacom on ngOnInit', () => {
    component.ngOnInit();
    expect(usuarioAppServiceStub.setInformacom).toHaveBeenCalled();
  });

  it('should open the menu when getAbrirMenu emits', () => {
    const openSpy = jest.spyOn(component.panelRef, 'open');
    component.ngOnInit();
    layoutServiceStub.getAbrirMenu!().subscribe(); // Llama al método seguro
    expect(openSpy).toHaveBeenCalled();
  });

  it('should close the menu when getCerrarMenu emits', () => {
    const closeSpy = jest.spyOn(component.panelRef, 'close');
    component.ngOnInit();
    layoutServiceStub.getCerrarMenu!().subscribe(); // Llama al método seguro
    expect(closeSpy).toHaveBeenCalled();
  });
});
