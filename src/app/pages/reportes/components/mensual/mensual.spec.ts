import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mensual } from './mensual';

describe('Mensual', () => {
  let component: Mensual;
  let fixture: ComponentFixture<Mensual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mensual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mensual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
