import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveStateColors } from './interactive-state-colors';

describe('InteractiveStateColors', () => {
  let component: InteractiveStateColors;
  let fixture: ComponentFixture<InteractiveStateColors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveStateColors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveStateColors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
