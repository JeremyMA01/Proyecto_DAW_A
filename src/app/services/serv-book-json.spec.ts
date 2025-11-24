import { TestBed } from '@angular/core/testing';

import { ServBookJson } from './serv-book-json';

describe('ServBookJson', () => {
  let service: ServBookJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServBookJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
