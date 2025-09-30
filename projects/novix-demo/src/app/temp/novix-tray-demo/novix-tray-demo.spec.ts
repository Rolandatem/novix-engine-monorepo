import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovixTrayDemo } from './novix-tray-demo';

describe('NovixTrayDemo', () => {
  let component: NovixTrayDemo;
  let fixture: ComponentFixture<NovixTrayDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixTrayDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixTrayDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
