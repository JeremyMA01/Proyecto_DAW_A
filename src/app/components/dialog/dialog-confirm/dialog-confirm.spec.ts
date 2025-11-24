import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirm } from './dialog-confirm';

describe('DialogConfirm', () => {
  let component: DialogConfirm;
  let fixture: ComponentFixture<DialogConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
