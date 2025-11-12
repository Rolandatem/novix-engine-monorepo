import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchProperties } from './switch-properties';

describe('SwitchProperties', () => {
  let component: SwitchProperties;
  let fixture: ComponentFixture<SwitchProperties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchProperties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchProperties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
