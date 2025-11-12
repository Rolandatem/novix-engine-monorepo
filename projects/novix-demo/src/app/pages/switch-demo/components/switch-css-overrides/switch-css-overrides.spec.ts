import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchCssOverrides } from './switch-css-overrides';

describe('SwitchCssOverrides', () => {
  let component: SwitchCssOverrides;
  let fixture: ComponentFixture<SwitchCssOverrides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchCssOverrides]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchCssOverrides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
