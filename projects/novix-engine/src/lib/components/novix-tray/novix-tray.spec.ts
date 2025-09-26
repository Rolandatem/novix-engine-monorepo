import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
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
    { input: 'handleBackground', expected: 'var(--novix-primary)' },
    { input: 'handleColor', expected: 'var(--novix-on-primary)' },
    { input: 'handleFontFamily', expected: 'var(--novix-font-family)' },
    { input: 'handleFontSize', expected: 'var(--novix-font-size-xs)' },
    { input: 'contentsBackground', expected: 'var(--novix-surface)' },
    { input: 'contentsColor', expected: 'var(--novix-on-surface)' },
    { input: 'contentsBorderColor', expected: 'var(--novix-primary)' }
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
      expect(component["_traySizeInternal"]()).toBe('500px');
    } else {
      expect(component["_traySizeInternal"]()).toBe('300px');
    }
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
  it('should subtract handle size from tray size when handle is shown', () => {
    fixture.componentRef.setInput('traySize', '400px');
    fixture.componentRef.setInput('showHandle', true);
    fixture.detectChanges();
    component['_trayHandleSize'].set('50px');
    expect(component.trayDimension()).toBe('calc(400px - 50px)');
  })

  //===========================================================================================================================
  it.each([
    { startOpen: true, showHandle: true, handleSize: '50px', expected: 'calc(300px - 0px)' },
    { startOpen: true, showHandle: false, handleSize: '0px', expected: '300px' },
    { startOpen: false, showHandle: true, handleSize: '50px', expected: '0px' },
    { startOpen: false, showHandle: false, handleSize: '0px', expected: '0px' }
  ])
  ('should return correct handleOffset based on test settings', (test) => {
    fixture.componentRef.setInput('startOpen', test.startOpen);
    fixture.componentRef.setInput('traySize', '300px');
    fixture.componentRef.setInput('showHandle', test.showHandle);
    component['_trayHandleSize'].set(test.handleSize);

    fixture.detectChanges();
    expect(component.handleOffset()).toBe(test.expected);
  })

  //===========================================================================================================================
  it('should not render tray content before view init', () => {
    expect(component.templateIsRendered()).toBe(false);
  });

  //===========================================================================================================================
  it('should render after view init', () => {
    fixture.detectChanges();
    expect(component.templateIsRendered()).toBe(true);
  });

  //===========================================================================================================================
  it('should open tray when openTray() is called and already open', () => {
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

    const contentTray = fixture.nativeElement.querySelector('.novix-tray-content');
    if (['left','right'].includes(direction)) {
      expect(contentTray.classList.contains('openLeftRight')).toBe(false);
    } else {
      expect(contentTray.classList.contains('openTopBottom')).toBe(false);
    }
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should render showing content tray when startOpen is true', (direction) => {
    fixture.componentRef.setInput('startOpen', true);
    fixture.componentRef.setInput('attachDirection', direction);
    fixture.detectChanges();

    const contentTray = fixture.nativeElement.querySelector('.novix-tray-content');
    if (['left','right'].includes(direction)) {
      expect(contentTray.classList.contains('openLeftRight')).toBe(true);
    } else {
      expect(contentTray.classList.contains('openTopBottom')).toBe(true);
    }
  });

  //===========================================================================================================================
  it.each(['left','right','top','bottom'])('should render try handle when showHandle is true', (direction) => {
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

    const handle = screen.getByText('HANDLE_TEXT');
    await userEvent.click(handle);
    fixture.detectChanges();

    const trayContent = fixture.nativeElement.querySelector('.novix-tray-content');
    expect(trayContent).not.toBeNull();
    expect(trayContent.classList.contains('openLeftRight')).toBe(true);
  });

  //===========================================================================================================================
  it('should close tray when handle is clicked while open', async() => {
    fixture.componentRef.setInput('handleText', 'HANDLE_TEXT');
    fixture.detectChanges();

    const handle = screen.getByText('HANDLE_TEXT');
    await userEvent.click(handle); //--Open
    fixture.detectChanges();

    await userEvent.click(handle); //--Close
    fixture.detectChanges();

    const trayContent = fixture.nativeElement.querySelector('.novix-tray-content');
    expect(trayContent.classList.contains('openLeftRight')).toBe(false);
  });
});
