import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { NovixTray } from './novix-tray';

describe('NovixTray - Structure', () => {
  let component: NovixTray;
  let fixture: ComponentFixture<NovixTray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixTray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixTray);
    component = fixture.componentInstance;

    //--Commenting out because we have tests that require data checking before
    //--ngAfterViewinit is fired.
    //fixture.detectChanges();
  });

  //===========================================================================================================================
  //--Component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //===========================================================================================================================
  //--Check all default input values are set.
  it.each([
    { input: 'attachDirection', expected: 'left' },
    { input: 'startOpen', expected: false },
    { input: 'rounded', expected: false },
    { input: 'showHandle', expected: true },
    { input: 'handleText', expected: undefined },
    { input: 'handleBackgroundColor', expected: null },
    { input: 'handleColor', expected: null },
    { input: 'handleFontFamily', expected: null },
    { input: 'handleFontSize', expected: null },
    { input: 'contentBackgroundColor', expected: null },
    { input: 'contentBorderColor', expected: null },
    { input: 'autoCloseOnOutsideClick', expected: false }
  ])('should have default values appropriately set', (test) => {
    fixture.detectChanges();
    //--Cast to keyof NovixTray to safely access signal inputs dynamically without
    //--TypeScript index errors.
    const inputKey = test.input as keyof NovixTray;
    //--Since there is a directive, we cannot guarantee a function, so
    //--we need to check it.
    const value = component[inputKey];
    expect(typeof value === 'function' ? value() : value).toBe(test.expected);
  });

  //--Specialty check for traySize since the default value happens internally.
  it.each(['left','right','top','bottom'])('should have default value for traySize/_traySizeInternal', (direction) => {
    expect(component.traySize()).toBe('');

    //--The value changes based on the value of attachDirection we need to make
    //--sure ngOnInit runs first.
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.detectChanges();

    if (component.isVertical()) {
      expect(component.trayContainerSize()).toBe('500px');
    } else {
      expect(component.trayContainerSize()).toBe('300px');
    }
  });

  //===========================================================================================================================
  it('should use traySize when specified', () => {
    fixture.componentRef.setInput('traySize', '400px');
    fixture.detectChanges();

    expect(component.trayContainerSize()).toBe('400px');
  });

  //===========================================================================================================================
  it('should initialize as not open with startOpen default false value', () => {
    expect(component.isOpen()).toBe(false);
  });

  //===========================================================================================================================
  it('should initialize as open when startOpen is true', () => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);
  });

  //===========================================================================================================================
  it('should toggle tray open/closed', () => {
    expect(component.isOpen()).toBe(false);
    component.toggleTray();
    expect(component.isOpen()).toBe(true);
  })

  //===========================================================================================================================
  it('should open tray when requested', () => {
    expect(component.isOpen()).toBe(false);
    component.openTray();
    expect(component.isOpen()).toBe(true);
  });

  //===========================================================================================================================
  it('should close tray when requested.', () => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    component.closeTray();
    expect(component.isOpen()).toBe(false);
  });

  //===========================================================================================================================
  it.each(['left', 'right', 'top', 'bottom'])('should detect correctly set attachment', (direction) => {
    fixture.componentRef.setInput('attachDirection', direction);
    expect(component.attachDirection()).toBe(direction);
  });

  //===========================================================================================================================
  it.each(['top', 'bottom'])('should detect vertical attachment', (direction) => {
    fixture.componentRef.setInput('attachDirection', direction);
    expect(component.isVertical()).toBe(true);
  });

  //===========================================================================================================================
  it.each(['left', 'right'])('it should detect false value for isVertical', (direction) => {
    fixture.componentRef.setInput('attachDirection', direction);
    expect(component.isVertical()).toBe(false);
  });

  //===========================================================================================================================
  it('should not open tray when openTray() is called and already open', () => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);

    const spy = vi.spyOn(component['_isOpen'], 'set');
    component.openTray();

    expect(spy).not.toHaveBeenCalled();
  });

  //===========================================================================================================================
  it('should not close tray when closeTray() is called and already closed', () => {
    expect(component.isOpen()).toBe(false);

    const spy = vi.spyOn(component['_isOpen'], 'set');
    component.closeTray();

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('NovixTray - UI Testing', () => {
  let component: NovixTray;
  let fixture: ComponentFixture<NovixTray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovixTray]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovixTray);
    component = fixture.componentInstance;

    //--Commenting out because we have tests that require data checking before
    //--ngAfterViewinit is fired.
    //fixture.detectChanges();
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should not render showing content tray when startOpen is false', (direction) => {
    fixture.componentRef.setInput('startOpen', false);
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.detectChanges();

    const tray = fixture.nativeElement;

    if (direction === 'left') { expect(tray.classList.contains('open')).toBe(false); }
    else if (direction === 'right') { expect(tray.classList.contains('open')).toBe(false); }
    else if (direction === 'top') { expect(tray.classList.contains('open')).toBe(false); }
    else { expect(tray.classList.contains('open')).toBe(false); }
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should render showing content tray when startOpen is true', (direction) => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.detectChanges();

    const tray = fixture.nativeElement;

    if (direction === 'left') { expect(tray.classList.contains('open')).toBe(true); }
    else if (direction === 'right') { expect(tray.classList.contains('open')).toBe(true); }
    else if (direction === 'top') { expect(tray.classList.contains('open')).toBe(true); }
    else { expect(tray.classList.contains('open')).toBe(true); }
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should render tray handle when showHandle is true', (direction) => {
    fixture.componentRef.setInput('showHandle', true);
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const handle = screen.getByText('HANDLE_TEXT');
    expect(handle).toBeTruthy();
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should not render tray handle when showHandle is false', (direction) => {
    fixture.componentRef.setInput('showHandle', false);
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const handle = screen.queryByText('HANDLE_TEXT');
    expect(handle).toBeNull();
  });

  //===========================================================================================================================
  it('should show default handle text when not set', () => {
    fixture.componentRef.setInput('showHandle', true);
    fixture.detectChanges();

    const handle = screen.getByText('⋮');
    expect(handle).toBeTruthy();
  });

  //===========================================================================================================================
  it('should show handle text override when set', () => {
    fixture.componentRef.setInput('showHandle', true);
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const handle = screen.getByText('HANDLE_TEXT');
    expect(handle).toBeTruthy();
  });

  //===========================================================================================================================
  it('should open tray when handle is clicked while closed', async() => {
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const tray = fixture.nativeElement;
    expect(tray).toBeTruthy();
    expect(tray.classList.contains('open')).toBe(false);

    const handle = screen.getByText('HANDLE_TEXT');
    await userEvent.click(handle);
    fixture.detectChanges();

    expect(tray.classList.contains('open')).toBe(true);
  });

  //===========================================================================================================================
  it('should close tray when handle is clicked while open', async() => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const tray = fixture.nativeElement;
    const handle = screen.getByText('HANDLE_TEXT');
    expect(tray).toBeTruthy();
    expect(handle).toBeTruthy();
    expect(tray.classList.contains('open')).toBe(true);
    await userEvent.click(handle);
    fixture.detectChanges();

    expect(tray.classList.contains('open')).toBe(false);
  });

  //===========================================================================================================================
  it('should auto-close tray when autoCloseOnOutsideClick is true and the user clicks on anything outside of the tray', async() => {
    fixture.componentRef.setInput('autoCloseOnOutsideClick', true);
    fixture.componentRef.setInput('startOpen', true);
    fixture.nativeElement.classList.add('no-transition');
    fixture.detectChanges();

    const tray = fixture.nativeElement;
    expect(tray).toBeTruthy();
    expect(tray.classList.contains('open')).toBe(true);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(tray.classList.contains('open')).toBe(false);
  });

  //===========================================================================================================================
  it('should not close tray when autoCloseOnOutsideClick is false and the user clicks on anything outside of the tray', async() => {
    fixture.componentRef.setInput('autoCloseOnOutsideClick', false);
    fixture.componentRef.setInput('startOpen', true);
    fixture.detectChanges();

    const tray = fixture.nativeElement;
    expect(tray).toBeTruthy();
    expect(tray.classList.contains('open')).toBe(true);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(tray.classList.contains('open')).toBe(true);
  });
});
