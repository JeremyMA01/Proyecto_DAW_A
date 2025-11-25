import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importamos la clase corregida
import { ReusableDialog } from './reusable-dialog'; 

// Las funciones globales de Vitest (como describe, it, expect) están disponibles
// gracias a "vitest/globals" en tsconfig.spec.json

describe('ReusableDialog', () => { 
  let component: ReusableDialog;
  let fixture: ComponentFixture<ReusableDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDialog] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Pruebas de interacción con Outputs ---

  it('debería emitir "aceptar" al llamar onAceptar()', () => {
    // Usamos vi.spyOn en lugar de jest.spyOn
    const acceptSpy = vi.spyOn(component.aceptar, 'emit'); 

    // Simulamos la acción
    component.onAceptar();

    // Verificamos que el evento fue emitido
    expect(acceptSpy).toHaveBeenCalled();
  });

  it('debería emitir "cancelar" al llamar onCancelar()', () => {
    // Usamos vi.spyOn en lugar de jest.spyOn
    const cancelSpy = vi.spyOn(component.cancelar, 'emit');

    // Simulamos la acción
    component.onCancelar();

    // Verificamos que el evento fue emitido
    expect(cancelSpy).toHaveBeenCalled();
  });
});