import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfData } from './transf-data';

describe('TransfData', () => {
  let component: TransfData;
  let fixture: ComponentFixture<TransfData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransfData]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransfData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
