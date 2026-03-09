import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pensiones } from './pensiones';

describe('Pensiones', () => {
  let component: Pensiones;
  let fixture: ComponentFixture<Pensiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pensiones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pensiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
