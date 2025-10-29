import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetProperties } from './cabinet-properties';

describe('CabinetProperties', () => {
  let component: CabinetProperties;
  let fixture: ComponentFixture<CabinetProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetProperties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
