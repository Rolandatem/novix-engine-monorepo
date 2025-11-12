import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchReusableConfig } from './switch-reusable-config';

describe('SwitchReusableConfig', () => {
  let component: SwitchReusableConfig;
  let fixture: ComponentFixture<SwitchReusableConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchReusableConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchReusableConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
