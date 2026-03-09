import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acuerdos } from './acuerdos';

describe('Acuerdos', () => {
  let component: Acuerdos;
  let fixture: ComponentFixture<Acuerdos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acuerdos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acuerdos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
