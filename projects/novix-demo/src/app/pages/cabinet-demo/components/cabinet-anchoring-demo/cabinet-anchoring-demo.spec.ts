import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetAnchoringDemo } from './cabinet-anchoring-demo';

describe('CabinetAnchoringDemo', () => {
  let component: CabinetAnchoringDemo;
  let fixture: ComponentFixture<CabinetAnchoringDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetAnchoringDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetAnchoringDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
