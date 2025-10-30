import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetCssOverrideDemo } from './cabinet-css-override-demo';

describe('CabinetCssOverrideDemo', () => {
  let component: CabinetCssOverrideDemo;
  let fixture: ComponentFixture<CabinetCssOverrideDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetCssOverrideDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetCssOverrideDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
