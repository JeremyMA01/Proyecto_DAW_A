import { TestBed } from '@angular/core/testing';

import { ServReviewApi } from './serv-review-api';

describe('ServReviewApi', () => {
  let service: ServReviewApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServReviewApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
