import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableReviewForm } from './reusable-review-form';

describe('ReusableReviewForm', () => {
  let component: ReusableReviewForm;
  let fixture: ComponentFixture<ReusableReviewForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableReviewForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableReviewForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
