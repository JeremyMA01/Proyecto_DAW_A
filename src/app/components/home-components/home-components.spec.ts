import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponents } from './home-components';

describe('HomeComponents', () => {
  let component: HomeComponents;
  let fixture: ComponentFixture<HomeComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
