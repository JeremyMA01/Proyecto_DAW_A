import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableSearch } from './reusable-search';

describe('ReusableSearch', () => {
  let component: ReusableSearch;
  let fixture: ComponentFixture<ReusableSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
