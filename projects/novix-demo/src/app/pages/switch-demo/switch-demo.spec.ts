import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDemo } from './switch-demo';

describe('SwitchDemo', () => {
  let component: SwitchDemo;
  let fixture: ComponentFixture<SwitchDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
