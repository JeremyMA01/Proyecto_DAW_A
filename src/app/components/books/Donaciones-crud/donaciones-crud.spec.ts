import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonacionesCrud } from './donaciones-crud';

describe('DonacionesCrud', () => {
  let component: DonacionesCrud;
  let fixture: ComponentFixture<DonacionesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonacionesCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonacionesCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
