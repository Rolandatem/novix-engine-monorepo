import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovixCabinetDemo } from './novix-cabinet-demo';

describe('NovixCabinetDemo', () => {
  let component: NovixCabinetDemo;
  let fixture: ComponentFixture<NovixCabinetDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixCabinetDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixCabinetDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
