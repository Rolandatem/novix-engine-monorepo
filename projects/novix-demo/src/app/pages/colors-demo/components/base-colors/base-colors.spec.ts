import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseColors } from './base-colors';

describe('BaseColors', () => {
  let component: BaseColors;
  let fixture: ComponentFixture<BaseColors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseColors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseColors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
