import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaContrasenaComponent } from './nueva-contrasena.component';

describe('NuevaContrasenaComponent', () => {
  let component: NuevaContrasenaComponent;
  let fixture: ComponentFixture<NuevaContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaContrasenaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
