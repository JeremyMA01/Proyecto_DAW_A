import { TestBed } from '@angular/core/testing';

import { ServHomeJson } from './serv-home-json';

describe('ServHomeJson', () => {
  let service: ServHomeJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServHomeJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
