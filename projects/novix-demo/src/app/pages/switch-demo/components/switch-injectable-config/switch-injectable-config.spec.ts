import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchInjectableConfig } from './switch-injectable-config';

describe('SwitchInjectableConfig', () => {
  let component: SwitchInjectableConfig;
  let fixture: ComponentFixture<SwitchInjectableConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchInjectableConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchInjectableConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
