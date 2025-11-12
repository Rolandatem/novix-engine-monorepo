import { ComponentFixture, TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';

import { NovixSwitch } from './novix-switch';
import { INovixSwitchConfiguration } from './internals/INovixSwitchConfiguration';
import { NOVIX_SWITCH_CONFIGURATION } from './internals/NovixSwitchConfigurationInjectionToken';

describe('NovixSwitch - Logic', () => {
  let component: NovixSwitch;
  let fixture: ComponentFixture<NovixSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixSwitch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //===========================================================================================================================
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //===========================================================================================================================
  it('should apply defaults when no inputs or config are provided', () => {
    const settings = component.settingsComputed();
    expect(settings.uiMode).toBe('horizontal');
    expect(settings.rounded).toBe(true);
    expect(settings.thumbColor).toBeNull();
  })

  //===========================================================================================================================
  it('should use direct input values when provided', () => {
    fixture.componentRef.setInput('uiMode', 'vertical');
    fixture.componentRef.setInput('thumbColor', 'red');
    fixture.detectChanges();

    const settings = component.settingsComputed();
    expect(settings.uiMode).toBe('vertical');
    expect(settings.thumbColor).toBe('red');
  })

  //===========================================================================================================================
  it('should use reusable config when provided', () => {
    const config: INovixSwitchConfiguration = {
      uiMode: 'vertical',
      rounded: false,
      trueBackgroundColor: 'green',
      falseBackgroundColor: null,
      thumbColor: null
    };
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    const settings = component.settingsComputed();
    expect(settings.uiMode).toBe('vertical');
    expect(settings.rounded).toBe(false);
    expect(settings.trueBackgroundColor).toBe('green');
  });

  //===========================================================================================================================
  it('should react when an input changes', () => {
    expect(component.settingsComputed().rounded).toBe(true);
    fixture.componentRef.setInput('rounded', false);
    fixture.detectChanges();

    expect(component.settingsComputed().rounded).toBe(false);
  })

  //===========================================================================================================================
  it('should pickup DI config if provided', async() => {
    await TestBed
      .resetTestingModule()
      .configureTestingModule({
        imports: [NovixSwitch],
        providers: [
          {
            provide: NOVIX_SWITCH_CONFIGURATION,
            useValue: { uiMode: 'vertical', rounded: false }
          }
        ]
      })
      .compileComponents();

    fixture = TestBed.createComponent(NovixSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const settings = component.settingsComputed();
    expect(settings.uiMode).toBe('vertical');
    expect(settings.rounded).toBe(false);
  })
});

//===========================================================================================================================
describe('NovixSwitch - UI', () => {

  //===========================================================================================================================
  it('should render with default horizontal + rounded classes', async() => {
    await render(NovixSwitch);
    const track = screen.getByRole('checkbox').nextElementSibling!;
    expect(track.classList.contains('rounded')).toBe(true);
    expect(track.parentElement!.classList.contains('novix-switch--horizontal')).toBe(true);
  })

  //===========================================================================================================================
  it('should apply vertical mode when uiMode input is set', async() => {
    await render(NovixSwitch, { inputs: { uiMode: 'vertical' }});
    const label = screen.getByRole('checkbox').parentElement!;
    expect(label.classList.contains('novix-switch--vertical')).toBe(true);
  })

  //===========================================================================================================================
  it('should apply thumbColor style when provided', async() => {
    await render(NovixSwitch, { inputs: { thumbColor: 'red' }});
    const thumb = screen.getByRole('checkbox')
      .nextElementSibling!
      .querySelector('.novix-switch-thumb')! as HTMLElement;
    expect(thumb.style.getPropertyValue('--novix-switch-thumb-color')).toBe('red');
  })

  //===========================================================================================================================
  it('should apply config values', async() => {
    await render(NovixSwitch, {
      inputs: {
        config: { uiMode: 'vertical', rounded: false, thumbColor: 'blue' }
      }
    });

    const label = screen.getByRole('checkbox').parentElement!;
    expect(label.classList.contains('novix-switch--vertical')).toBe(true);

    const track = label.querySelector('.novix-switch-track')!;
    expect(track.classList.contains('rounded')).toBe(false);

    const thumb = track.querySelector('.novix-switch-thumb')! as HTMLElement;
    expect(thumb.style.getPropertyValue('--novix-switch-thumb-color')).toBe('blue');
  })

  //===========================================================================================================================
  it('should toggle checked state when clicked', async() => {
    await render(NovixSwitch);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);

    input.click();
    expect(input.checked).toBe(true);
  })
})
