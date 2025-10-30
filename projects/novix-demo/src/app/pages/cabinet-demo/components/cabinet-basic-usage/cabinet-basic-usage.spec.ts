import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetBasicUsage } from './cabinet-basic-usage';

describe('CabinetBasicUsage', () => {
  let component: CabinetBasicUsage;
  let fixture: ComponentFixture<CabinetBasicUsage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetBasicUsage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetBasicUsage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
