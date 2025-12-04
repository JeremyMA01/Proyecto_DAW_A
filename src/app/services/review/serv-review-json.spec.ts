import { TestBed } from '@angular/core/testing';

import { ServReviewJson } from './serv-review-json';

describe('ServReviewJson', () => {
  let service: ServReviewJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServReviewJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
