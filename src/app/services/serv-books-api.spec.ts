import { TestBed } from '@angular/core/testing';

import { ServBooksApi } from './serv-books-api';

describe('ServBooksApi', () => {
  let service: ServBooksApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServBooksApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
