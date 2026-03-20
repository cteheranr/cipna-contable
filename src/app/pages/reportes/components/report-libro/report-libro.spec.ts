import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLibro } from './report-libro';

describe('ReportLibro', () => {
  let component: ReportLibro;
  let fixture: ComponentFixture<ReportLibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLibro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLibro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
