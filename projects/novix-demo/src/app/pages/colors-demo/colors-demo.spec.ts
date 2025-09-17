import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsDemo } from './colors-demo';

describe('ColorsDemo', () => {
  let component: ColorsDemo;
  let fixture: ComponentFixture<ColorsDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorsDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
