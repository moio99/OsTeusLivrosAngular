import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeComponent } from './pe.component';
import { LayoutService } from '../../services/flow/layout.service';
import { of } from 'rxjs';
import { InformacomPeTipo } from '../../../shared/enums/estadisticasTipos';
import { InformacomPe } from '../../../shared/models/outros.model';

describe('PeComponent', () => {
  let component: PeComponent;
  let fixture: ComponentFixture<PeComponent>;
  let layoutService: jest.Mocked<LayoutService>;

  beforeEach(async () => {
    const layoutServiceMock = {
      getInformacom: jest.fn(),
    };

    await TestBed.configureTestingModule({
      // declarations: [PeComponent],     nom por que é standalone
      imports: [ PeComponent ],
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService) as jest.Mocked<LayoutService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and get information on ngOnInit', () => {
    const mockInfo: InformacomPe = { tipo: InformacomPeTipo.Info, mensagem: 'Test message', duracom: 5 };
    layoutService.getInformacom.mockReturnValueOnce(of(mockInfo));

    component.ngOnInit();

    expect(layoutService.getInformacom).toHaveBeenCalled();
    expect(component.tipo).toBe(mockInfo.tipo);
    expect(component.mensagem).toBe(mockInfo.mensagem);
    expect(component.visivel).toBe(true);
  });

  // Como tarda demasiado Jest nom o permite
  /* it('should hide the message after the specified duration', async () => {
    jest.useFakeTimers(); // Usar temporizadores simulados
    const mockInfo: InformacomPe = { tipo: InformacomPeTipo.Info, mensagem: 'Test message', duracom: 1 }; // 1 segundo
    layoutService.getInformacom.mockReturnValueOnce(of(mockInfo));

    component.ngOnInit();
    // Simular la pausa
    await component.pausa(1000); // Esperar 1 segundo
    expect(component.visivel).toBe(true); // El mensaje aún debería ser visible antes de la pausa
    await component.pausa(5000); // Simular el tiempo de la pausa predeterminada
    expect(component.visivel).toBe(false); // Después de 5 segundos, el mensaje debería estar oculto
  }); */

  it('should handle undefined info and set visivel to false', () => {
    layoutService.getInformacom.mockReturnValueOnce(of(undefined));

    component.ngOnInit();

    expect(component.visivel).toBe(false);
  });

  // Como tarda demasiado Jest nom o permite
  /* it('should correctly handle messages without a duration', async () => {
    jest.useFakeTimers();
    const mockInfo: InformacomPe = { tipo: InformacomPeTipo.Info, mensagem: 'Message without duration', duracom: undefined };
    layoutService.getInformacom.mockReturnValueOnce(of(mockInfo));

    component.ngOnInit();
    expect(component.visivel).toBe(true); // El mensaje debería ser visible

    // Simular el tiempo por defecto de 5 segundos
    await component.pausa(5000);
    expect(component.visivel).toBe(false); // El mensaje debería estar oculto después de 5 segundos
  }); */
});
