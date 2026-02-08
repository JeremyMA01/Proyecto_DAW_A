import { TestBed } from '@angular/core/testing';

import { ServDonaciones } from './serv-donaciones';

describe('ServDonaciones', () => {
  let service: ServDonaciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServDonaciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
