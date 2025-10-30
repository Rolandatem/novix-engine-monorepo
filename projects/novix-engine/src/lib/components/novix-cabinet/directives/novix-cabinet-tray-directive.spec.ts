import { Component, ErrorHandler, PLATFORM_ID, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NovixCabinetTrayDirective } from "./novix-cabinet-tray-directive";
import { NovixCabinet } from "../novix-cabinet";
import { MockNovixCabinet } from "../../../testing/mocks/mock-novix-cabinet";
import { NovixCardinalDirection } from "../../../types/NovixCardinalDirections";
import userEvent from "@testing-library/user-event";

@Component({
  template: `<ng-template novix-cabinet-tray
              [traySize]="hostTraySize">
            </ng-template>`,
  standalone: true,
  imports: [NovixCabinetTrayDirective]
})
class HostComponent {
  @ViewChild(NovixCabinetTrayDirective)
  public tray!: NovixCabinetTrayDirective;

  public hostTraySize = '';
}

describe('NovixCabinetTrayDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let mockNovixCabinet: MockNovixCabinet;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        NovixCabinetTrayDirective,
        HostComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: NovixCabinet, useClass: MockNovixCabinet }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    mockNovixCabinet = TestBed.inject(NovixCabinet) as unknown as MockNovixCabinet;
  })

  //===========================================================================================================================
  it('should be created', () => {
    fixture.detectChanges();
    expect(component.tray).toBeTruthy();
  })

  //===========================================================================================================================
  it.each(['left','right','top','bottom'] as const)('should respect attachDirection(%s) set off parent cabinet', (direction: NovixCardinalDirection) => {
    mockNovixCabinet.attachDirection.set(direction);
    fixture.detectChanges();
    expect(component.tray.attachDirection()).toBe(direction);
  })

  //===========================================================================================================================
  it('should calculate handle height for an existing handle', () => {
    mockNovixCabinet.attachDirection.set('top');
    fixture.detectChanges();

    component.tray.setElementReferences(undefined, {
      offsetHeight: 50,
      offsetWidth: 100
    } as HTMLElement)
    expect(component.tray.calculatedHandleHeight()).toBe('50px');
    expect(component.tray.calculatedHandleWidth()).toBe('100px');
  })

  //===========================================================================================================================
  it('should return 0 for calculatedHandleHeight if no handle was referenced', () => {
    mockNovixCabinet.attachDirection.set('top');
    fixture.detectChanges();

    expect(component.tray.calculatedHandleHeight()).toBe('0px');
  })

  //===========================================================================================================================
  it('should calculate handle width for an existing handle', () => {
    fixture.detectChanges();
    component.tray.setElementReferences(undefined, {
      offsetHeight: 50,
      offsetWidth: 100
    } as HTMLElement);

    expect(component.tray.calculatedHandleHeight()).toBe('50px');
    expect(component.tray.calculatedHandleWidth()).toBe('100px');
  })

  //===========================================================================================================================
  it('should return 0 for calculatedHandleWidth if no handle was referenced', () => {
    fixture.detectChanges();
    expect(component.tray.calculatedHandleWidth()).toBe('0px');
  })

  //===========================================================================================================================
  it('should respect overridden traySize', () => {
    component.hostTraySize = '450px';
    fixture.detectChanges();

    expect(component.tray.trayContainerSize()).toBe('450px');
  })

  //===========================================================================================================================
  it.each([
    { attachDirection: 'left', direction: 'left', openTray: false, expected: 'calc(-1 * (450px - 100px))' },
    { attachDirection: 'left', direction: 'left', openTray: true, expected: '0px' },
    { attachDirection: 'left', direction: 'right', openTray: false, expected: 'auto' },
    { attachDirection: 'right', direction: 'left', openTray: false, expected: 'auto' },
    { attachDirection: 'top', direction: 'bottom', openTray: false, expected: 'auto' },
    { attachDirection: 'bottom', direction: 'top', openTray: false, expected: 'auto' },
    { attachDirection: 'left', direction: 'top', openTray: false, expected: '0px' }
  ])('should calculate correct directional tray position (%s)', (test) => {
    mockNovixCabinet.attachDirection.set(test.attachDirection as NovixCardinalDirection);
    component.hostTraySize = '450px';
    fixture.detectChanges();

    component.tray.setElementReferences(undefined, {
      offsetHeight: 100,
      offsetWidth: 100
    } as HTMLElement);

    component.tray.ngAfterViewInit();
    fixture.detectChanges();

    if (test.openTray) {
      component.tray.open();
      fixture.detectChanges();
    }

    expect(component.tray['commonPositionCalculation'](test.direction as NovixCardinalDirection)).toBe(test.expected);
  })

  //===========================================================================================================================
  it.each([
    { attachDirection: 'left', direction: 'left', openTray: false, expected: '0px' },
    { attachDirection: 'left', direction: 'left', openTray: true, expected: '450px' },
    { attachDirection: 'right', direction: 'left', openTray: false, expected: 'auto' },
    { attachDirection: 'top', direction: 'bottom', openTray: false, expected: 'auto' },
    { attachDirection: 'bottom', direction: 'top', openTray: false, expected: 'auto' },
    { attachDirection: 'left', direction: 'top', openTray: false, expected: '0px' }
  ])('should calculate correct directional handle position (%s)', (test) => {
    mockNovixCabinet.attachDirection.set(test.attachDirection as NovixCardinalDirection);
    component.hostTraySize = '450px';
    fixture.detectChanges();

    component.tray.ngAfterViewInit();
    fixture.detectChanges();

    if (test.openTray) {
      component.tray.open();
      fixture.detectChanges();
    }

    expect(component.tray['commonHandlePositionCalculation'](test.direction as NovixCardinalDirection)).toBe(test.expected);
  })

  //===========================================================================================================================
  it('should close tray when open and autoCloseOnOutsideClick is on and user clicks outside of tray', async() => {
    mockNovixCabinet.autoCloseOnOutsideClick.set(true);
    fixture.detectChanges();

    component.tray.setElementReferences(
      document.createElement('div'),
      document.createElement('div')
    );
    component.tray.ngAfterViewInit();
    component.tray.open();
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(true);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(component.tray.isOpen()).toBe(false);
  })

  //===========================================================================================================================
  it('should not close tray when open and autoCloseOnOutsideClick is off and user clicks outside of tray', async() => {
    fixture.detectChanges();

    component.tray.setElementReferences(
      document.createElement('div'),
      document.createElement('div')
    );
    component.tray.ngAfterViewInit();
    component.tray.open();
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(true);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(component.tray.isOpen()).toBe(true);
  })

  //===========================================================================================================================
  it('should not try to close tray when already closed and autoCloseOnOutsideClick is on and user clicks outside of tray', async() => {
    mockNovixCabinet.autoCloseOnOutsideClick.set(true);
    fixture.detectChanges();

    const trayCloseSpy = vi.spyOn(component.tray, 'close');
    component.tray.setElementReferences(
      document.createElement('div'),
      document.createElement('div')
    );
    component.tray.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(false);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(component.tray.isOpen()).toBe(false);
    expect(trayCloseSpy).not.toHaveBeenCalled();
  })

  //===========================================================================================================================
  it('should process null check on both the trayEl and handleEl in the handleOutsideClick event (code coverage) and the tray is open with autoCloseOnOutsideClick is on', async() => {
    mockNovixCabinet.autoCloseOnOutsideClick.set(true);
    fixture.detectChanges();

    const trayCloseSply = vi.spyOn(component.tray, "close");
    component.tray.ngAfterViewInit();
    component.tray.open();
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(true);

    await userEvent.click(document.body);
    fixture.detectChanges();

    expect(component.tray.isOpen()).toBe(true);
    expect(trayCloseSply).not.toHaveBeenCalled();
  })

  //===========================================================================================================================
  it('should open the tray when open is called and the tray is currently closed', () => {
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(false);

    component.tray.open();
    expect(component.tray.isOpen()).toBe(true);
  })

  //===========================================================================================================================
  it('should not open tray when open is called and the tray is already open', () => {
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(false);

    component.tray.open();
    expect(component.tray.isOpen()).toBe(true);

    const trayOpenSetSpy = vi.spyOn(component.tray.isOpen, "set");
    component.tray.open();
    expect(trayOpenSetSpy).not.toHaveBeenCalled();
  })

  //===========================================================================================================================
  it('should close tray when close is called and the tray is currently open', () => {
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(false);

    component.tray.open();
    expect(component.tray.isOpen()).toBe(true);

    component.tray.close();
    expect(component.tray.isOpen()).toBe(false);
  })

  //===========================================================================================================================
  it('should not close tray when close is called and the tray is already closed', () => {
    fixture.detectChanges();
    expect(component.tray.isOpen()).toBe(false);

    const trayOpenSetSpy = vi.spyOn(component.tray.isOpen, "set");
    component.tray.close();
    expect(component.tray.isOpen()).toBe(false);
    expect(trayOpenSetSpy).not.toHaveBeenCalled();
  })

  //===========================================================================================================================
  it('should toggle open/closed state when toggle is called', () => {
    fixture.detectChanges();

    const initialOpenValue = component.tray.isOpen();
    component.tray.toggle();

    expect(component.tray.isOpen()).not.toBe(initialOpenValue);
  })
})

describe('NovixCabinetTrayDirective - Server', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: HostComponent;
  let mockNovixCabinet: MockNovixCabinet;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        NovixCabinetTrayDirective,
        HostComponent
      ],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: NovixCabinet, useClass: MockNovixCabinet }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    mockNovixCabinet = TestBed.inject(NovixCabinet) as unknown as MockNovixCabinet;
  })

  //===========================================================================================================================
  it('should be created (code coverage)', () => {
    fixture.detectChanges();
    expect(component.tray).toBeTruthy();
  })
})
