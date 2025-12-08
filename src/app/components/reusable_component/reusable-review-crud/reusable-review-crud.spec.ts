import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableReviewCrud } from './reusable-review-crud';

describe('ReusableReviewCrud', () => {
  let component: ReusableReviewCrud;
  let fixture: ComponentFixture<ReusableReviewCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableReviewCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableReviewCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
