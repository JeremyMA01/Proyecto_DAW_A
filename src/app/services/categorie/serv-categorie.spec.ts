import { TestBed } from '@angular/core/testing';

import { ServCategorie } from './serv-categorie';

describe('ServCategorie', () => {
  let service: ServCategorie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServCategorie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
