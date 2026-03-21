import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasExternas } from './ventas-externas';

describe('VentasExternas', () => {
  let component: VentasExternas;
  let fixture: ComponentFixture<VentasExternas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasExternas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasExternas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
