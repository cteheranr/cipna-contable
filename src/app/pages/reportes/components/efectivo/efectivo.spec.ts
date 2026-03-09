import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Efectivo } from './efectivo';

describe('Efectivo', () => {
  let component: Efectivo;
  let fixture: ComponentFixture<Efectivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Efectivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Efectivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
