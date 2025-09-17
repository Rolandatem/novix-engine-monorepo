import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovixTray } from './novix-tray';

describe('NovixTray', () => {
  let component: NovixTray;
  let fixture: ComponentFixture<NovixTray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixTray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixTray);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
