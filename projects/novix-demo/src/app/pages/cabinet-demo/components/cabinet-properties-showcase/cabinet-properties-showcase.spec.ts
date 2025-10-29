import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetPropertiesShowcase } from './cabinet-properties-showcase';

describe('CabinetPropertiesShowcase', () => {
  let component: CabinetPropertiesShowcase;
  let fixture: ComponentFixture<CabinetPropertiesShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetPropertiesShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetPropertiesShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
