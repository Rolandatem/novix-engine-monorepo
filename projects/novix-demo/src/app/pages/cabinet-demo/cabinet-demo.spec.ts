import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetDemo } from './cabinet-demo';

describe('CabinetDemo', () => {
  let component: CabinetDemo;
  let fixture: ComponentFixture<CabinetDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinetDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
