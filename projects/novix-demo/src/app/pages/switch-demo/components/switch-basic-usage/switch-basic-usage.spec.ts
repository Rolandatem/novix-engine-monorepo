import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchBasicUsage } from './switch-basic-usage';

describe('SwitchBasicUsage', () => {
  let component: SwitchBasicUsage;
  let fixture: ComponentFixture<SwitchBasicUsage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchBasicUsage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchBasicUsage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
