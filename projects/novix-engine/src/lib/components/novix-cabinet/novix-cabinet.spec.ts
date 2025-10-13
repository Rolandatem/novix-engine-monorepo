import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovixCabinet } from './novix-cabinet';

describe('NovixCabinet', () => {
  let component: NovixCabinet;
  let fixture: ComponentFixture<NovixCabinet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixCabinet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixCabinet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
