import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovixCabinet } from './novix-cabinet';
import { ElementRef, QueryList } from '@angular/core';
import { createMockNovixCabinetTrayDirective } from '../../testing/mocks/mock-novix-cabinet-tray-directive';

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

  //===========================================================================================================================
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //===========================================================================================================================
  it('should interate tray directives and set references to their respective tray and handle elements', () => {
    const trayElement = new ElementRef<HTMLElement>(document.createElement('div'));
    const handleElement = new ElementRef<HTMLElement>(document.createElement('div'));

    const trayDirective = createMockNovixCabinetTrayDirective();

    component.trays = new QueryList<any>();
    (component.trays as any)._results = [trayDirective];

    component.trayElements = new QueryList<any>();
    (component.trayElements as any)._results = [trayElement];

    component.handleElements = new QueryList<any>();
    (component.handleElements as any)._results = [handleElement];

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(trayDirective.setElementReferences).toHaveBeenCalledTimes(1);
    expect(trayDirective.setElementReferences).toHaveBeenNthCalledWith(1,
      trayElement.nativeElement, handleElement.nativeElement
    )
  })

  //===========================================================================================================================
  it('should pass undefined values for the tray and html handles when they are not specified (code coverage)', () => {
    const trayDirective = createMockNovixCabinetTrayDirective();

    component.trays = new QueryList<any>();
    (component.trays as any)._results = [trayDirective];

    component.trayElements = new QueryList<any>();
    component.handleElements = new QueryList<any>();

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(trayDirective.setElementReferences).toHaveBeenCalledWith(undefined, undefined);
  })

  //===========================================================================================================================
  it('should toggle the specified tray and close the others', () => {
    const firstTrayDirective = createMockNovixCabinetTrayDirective();
    const secondTrayDirective = createMockNovixCabinetTrayDirective();
    const thirdTrayDirective = createMockNovixCabinetTrayDirective();

    component.trays = new QueryList<any>();
    (component.trays as any)._results = [
      firstTrayDirective,
      secondTrayDirective,
      thirdTrayDirective
    ];

    //--Toggle first tray.
    component.toggleTray(0);

    expect(component.trays.get(0)?.isOpen()).toBe(true);
    expect(component.trays.get(1)?.isOpen()).toBe(false);
    expect(component.trays.get(2)?.isOpen()).toBe(false);

    //--Toggle second tray
    component.toggleTray(1);
    expect(component.trays.get(0)?.isOpen()).toBe(false);
    expect(component.trays.get(1)?.isOpen()).toBe(true);
    expect(component.trays.get(2)?.isOpen()).toBe(false);
  })

  //===========================================================================================================================
  it('should use have correct edgeMargin when using vertical attachment (code coverage)', () => {
    fixture.componentRef.setInput('attachDirection', 'top');
    fixture.componentRef.setInput('edgeMargin', '40px');
    fixture.detectChanges();

    expect(component.edgeMargin()).toBe('40px');
  })
});
