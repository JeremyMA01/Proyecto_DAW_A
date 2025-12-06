import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarCodigoComponent } from './verificar-codigo';

describe('VerificarCodigo', () => {
  let component: VerificarCodigoComponent;
  let fixture: ComponentFixture<VerificarCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarCodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarCodigoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
