import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorOpacity } from './color-opacity';

describe('ColorOpacity', () => {
  let component: ColorOpacity;
  let fixture: ComponentFixture<ColorOpacity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorOpacity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorOpacity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
