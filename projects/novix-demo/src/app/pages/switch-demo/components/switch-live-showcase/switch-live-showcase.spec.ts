import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchLiveShowcase } from './switch-live-showcase';

describe('SwitchLiveShowcase', () => {
  let component: SwitchLiveShowcase;
  let fixture: ComponentFixture<SwitchLiveShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchLiveShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchLiveShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
