import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDialog } from './reusable-dialog'; 


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


  it('debería emitir "aceptar" al llamar onAceptar()', () => {
    const acceptSpy = vi.spyOn(component.aceptar, 'emit'); 

    component.onAceptar();

    expect(acceptSpy).toHaveBeenCalled();
  });

  it('debería emitir "cancelar" al llamar onCancelar()', () => {
    const cancelSpy = vi.spyOn(component.cancelar, 'emit');

    component.onCancelar();

    expect(cancelSpy).toHaveBeenCalled();
  });
});