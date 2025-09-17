import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorContrast } from './color-contrast';

describe('ColorContrast', () => {
  let component: ColorContrast;
  let fixture: ComponentFixture<ColorContrast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorContrast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorContrast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
