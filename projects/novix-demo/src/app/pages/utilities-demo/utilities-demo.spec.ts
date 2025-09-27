import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitiesDemo } from './utilities-demo';

describe('UtilitiesDemo', () => {
  let component: UtilitiesDemo;
  let fixture: ComponentFixture<UtilitiesDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilitiesDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilitiesDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
