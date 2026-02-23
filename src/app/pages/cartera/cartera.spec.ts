import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cartera } from './cartera';

describe('Cartera', () => {
  let component: Cartera;
  let fixture: ComponentFixture<Cartera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cartera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
