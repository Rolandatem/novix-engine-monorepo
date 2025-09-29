import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesDemo } from './themes-demo';

describe('ThemesDemo', () => {
  let component: ThemesDemo;
  let fixture: ComponentFixture<ThemesDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemesDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemesDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
