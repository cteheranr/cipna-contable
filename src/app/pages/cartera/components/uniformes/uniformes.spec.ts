import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uniformes } from './uniformes';

describe('Uniformes', () => {
  let component: Uniformes;
  let fixture: ComponentFixture<Uniformes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uniformes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Uniformes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
