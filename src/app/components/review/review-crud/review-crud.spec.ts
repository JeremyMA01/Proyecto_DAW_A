import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCrud } from './review-crud';

describe('ReviewCrud', () => {
  let component: ReviewCrud;
  let fixture: ComponentFixture<ReviewCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
