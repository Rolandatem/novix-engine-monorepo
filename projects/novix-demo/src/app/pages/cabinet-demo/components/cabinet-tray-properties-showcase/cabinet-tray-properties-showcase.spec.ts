import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetTrayPropertiesShowcase } from './cabinet-tray-properties-showcase';

describe('CabinetTrayPropertiesShowcase', () => {
  let component: CabinetTrayPropertiesShowcase;
  let fixture: ComponentFixture<CabinetTrayPropertiesShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetTrayPropertiesShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetTrayPropertiesShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
